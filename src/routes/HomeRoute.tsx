import { Button, Typography } from "@material-tailwind/react";
import { addToCart } from "../data/cartData";
import { useEffect, useState } from "react";
import { getAllProducts } from "../data/productsData";
import {  useRecoilState } from "recoil";
import { cartAtom } from "../store/atoms/cartAtoms";

export default function HomeRoute() {
    const [products, setProducts] = useState<Product[]>([])
    const [cart, setCart] = useRecoilState(cartAtom);

    useEffect(() => {
        getAllProducts().then((val) => setProducts(val))
    }, [])

    async function handleAddToCart(cartItem: CartItem) {
        if (cart == null) return;

        if(cart.cartItems.some(item => item.productId == cartItem.productId)) return;

        addToCart(cart.id, cartItem)

        setCart((cart) => {
            let newCart: Cart = {
                ...cart!,
                cartItems: [...cart!.cartItems, cartItem],
                quantity: cart!.quantity + 1,
            }
            return newCart;
        })
    }

    return (
        <div className="flex flex-col space-y-3 my-8">
            {
                products.map((product) => {
                    return <div key={product.id} className="border-2 p-3 flex justify-between mx-4 border-black">
                        <div>
                            <Typography>{product.id}</Typography>
                            <Typography>{product.name}</Typography>
                        </div>

                        <Button onClick={() => {
                            handleAddToCart({
                                price: product.price,
                                productId: product.id,
                                quantity: 1,
                            })
                        }}>Add to Cart</Button>
                    </div>
                })
            }
        </div>
    )
}