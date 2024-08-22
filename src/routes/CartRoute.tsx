import { Button, Typography } from "@material-tailwind/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartAtom, cartCountAtom, cartPriceAtom } from "../store/atoms/cartAtoms";
import { modifyCartItemCount, removeFromCart } from "../data/cartData";
import { useNavigate } from "react-router-dom";

export default function CartRoute() {
    const [cart, setCart] = useRecoilState(cartAtom);
    const cartCount = useRecoilValue(cartCountAtom);
    const cartPrice = useRecoilValue(cartPriceAtom);

    const navigate = useNavigate();

    const cartitems = cart?.cartItems;

    async function handleRemoveFromCart(productId: string) {
        await removeFromCart({ cartId: cart!.id, productId })

        setCart((cart) => {
            const items = cart!.cartItems.filter((item) => item.productId != productId)
            const itemCount = cart!.cartItems.find((item) => item.productId == productId)!.quantity

            return {
                ...cart!,
                cartItems: items,
                quantity: cart!.quantity - itemCount
            }
        })
    }

    async function handleQuantityModification(productId: string, { toIncrement }: { toIncrement: boolean }) {
        await modifyCartItemCount({ cartId: cart!.id, productId, action: toIncrement ? 'increment' : 'decrement' })

        setCart((cart) => {
            const items = cart!.cartItems.map((item) =>
                item.productId == productId
                    ? { ...item, quantity: toIncrement ? item.quantity + 1 : item.quantity - 1 }
                    : item
            ).filter((item) => item.quantity > 0);

            return {
                ...cart!,
                cartItems: items,
                quantity: toIncrement ? cart!.quantity + 1 : cart!.quantity - 1
            }
        })
    }

    return (
        <div className="mx-auto mt-10 lg:max-w-screen-xl px-6 py-3">
            <Typography variant="h2" className="flex justify-center mt-4">Cart</Typography>

            <hr className="my-4" />
            
            <div className="mx-auto lg:max-w-screen-xl my-4 grid grid-cols-12">
                <div className="col-span-8 mx-4">
                    <div className="grid grid-cols-10">
                        <div className="col-span-4">
                            Product
                        </div>
                        <div className="col-span-2 flex justify-center">
                            Quantity
                        </div>
                        <div className="col-span-2 flex justify-center">
                            Price
                        </div>
                        <div className="col-span-2 flex justify-center">
                            Subtotal
                        </div>
                    </div>

                    <hr className="h-0.5 bg-black/60 my-2" />

                    {
                        cartitems?.map((item) => {
                            return <div key={item.productId} className="grid grid-cols-10">
                                <div className="col-span-4 flex space-x-2">
                                    <div>{item.productId}</div>
                                    <div className="text-red-800 cursor-pointer" onClick={() => {
                                        handleRemoveFromCart(item.productId)
                                    }}>Remove</div>
                                </div>
                                <div className="col-span-2 flex justify-center space-x-2">
                                    <div className="cursor-pointer" onClick={() => {
                                        handleQuantityModification(item.productId, { toIncrement: false })
                                    }}>-</div>
                                    <div>{item.quantity}</div>
                                    <div className="cursor-pointer" onClick={() => {
                                        handleQuantityModification(item.productId, { toIncrement: true })
                                    }}>+</div>
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    {item.price}
                                </div>
                                <div className="col-span-2 flex justify-center">
                                    {item.price * item.quantity}
                                </div>
                            </div>
                        })
                    }
                </div>

                <div className="col-span-4 mx-4">
                    <div className="w-full border rounded border-black p-3">
                        <Typography variant="lead" className="mb-2">
                            Cart Summary
                        </Typography>

                        <div className="flex justify-between">
                            <Typography>{`Price (${cartCount} items)`}</Typography>
                            <Typography>{`${cartPrice}`}</Typography>
                        </div>

                        <div className="flex justify-between">
                            <Typography>Delivery Charges</Typography>
                            <Typography>20</Typography>
                        </div>

                        <hr className="my-2 bg-black/50" />

                        <div className="flex justify-between">
                            <Typography variant="h6">Total Amount</Typography>
                            <Typography>20</Typography>
                        </div>

                        <Button color="teal" fullWidth className="mt-6" onClick={() => navigate('/checkout')}>Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}