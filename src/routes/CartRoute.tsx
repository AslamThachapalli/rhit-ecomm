import { Button } from "@material-tailwind/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { cartAtom, cartCountAtom, cartPriceAtom } from "../store/atoms/cartAtoms";
import { modifyCartItemCount, removeFromCart } from "../data/cartData";
import { useNavigate } from "react-router-dom";
import { allProductsAtom } from "../store/atoms/productAtoms";
import { formatToPrice } from "../lib/formatters";
import {
    PlusIcon,
    MinusIcon,
} from "@heroicons/react/24/outline";
import { Nullable } from "../lib/globals";

export default function CartRoute() {
    const [cart, setCart] = useRecoilState(cartAtom);
    const cartCount = useRecoilValue(cartCountAtom);
    const cartPrice = useRecoilValue(cartPriceAtom);
    const allProducts = useRecoilValue(allProductsAtom)

    const navigate = useNavigate();

    const cartitems = cart?.cartItems;

    let products = cartitems?.map((item) => {
        return allProducts.find((product) => product.id === item.productId)
    })

    const getProduct = (id: string): Nullable<Product> => {
        return products?.find(item => item?.id == id)
    }

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
        <div className="mx-auto pt-20 px-6 pb-28 min-h-screen lg:max-w-screen-xl">
            <div className="font-black text-4xl lg:text-6xl">Your Bag</div>

            <div className="flex flex-col gap-6 sm:gap-10 mt-8 sm:mt-10">
                {
                    cartitems?.map((item, index) => {
                        const product = getProduct(item.productId);
                        return <div
                            key={`cartItem-${index}`}
                            className="flex justify-between items-stretch gap-5 sm:gap-10 lg:gap-20 bg-gradient-to-br from-yellow-700 to-indigo-50 p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <img
                                src={product?.mainImg}
                                alt={product?.heading}
                                className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-md bg-white p-2"
                            />
                            <div className="flex flex-1 flex-col justify-between items-start">
                                <h1 className="font-bold text-sm md:text-xl text-ellipsis">{product?.name}</h1>
                                <div className="flex items-center gap-5 sm:gap-8">
                                    <MinusIcon
                                        className="h-4 w-4 cursor-pointer"
                                        onClick={() => handleQuantityModification(item.productId, { toIncrement: false })}
                                    />
                                    <p className="text-xs sm:text-base sm:font-semibold">{item.quantity}</p>
                                    <PlusIcon
                                        className="h-4 w-4 cursor-pointer"
                                        onClick={() => handleQuantityModification(item.productId, { toIncrement: true })}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                                <h2 className="font-bold text-sm md:text-xl">{formatToPrice(item.price * item.quantity)}</h2>
                                <button
                                    className="mx-3 text-xs sm:text-base"
                                    onClick={() => handleRemoveFromCart(item.productId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    })
                }
            </div>

            <div
                className="fixed bottom-0 right-0 left-0 h-24 sm:h-28 w-full py-6 sm:py-8 bg-white"
                style={{ borderTop: "solid", borderColor: "#C3CBCB" }}
            >
                <div className="lg:max-w-screen-xl px-4 sm:px-8 mx-auto flex justify-between items-center">
                    <div className="flex flex-col items-start justify-center">
                        <h3 className="font-bold text-base sm:text-xl">Subtotal <span className="ml-2">{formatToPrice(cartPrice ?? 0)}</span></h3>
                        <p className="font-medium text-xs sm:text-sm">Taxes and shipping calculated at checkout</p>
                    </div>

                    <Button
                        onClick={() => navigate('/checkout')}
                    >
                        Checkout
                    </Button>
                </div>
            </div>
        </div>
    )
}