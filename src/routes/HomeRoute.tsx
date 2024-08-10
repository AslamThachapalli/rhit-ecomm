import { Button, Typography } from "@material-tailwind/react";
import { baseUrl, rzrpKeyId } from "../lib/global.vars";
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

function loadScript(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

async function displayRazorpay() {

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
        alert('Razropay failed to load!!')
        return
    }

    let checkoutAmount: number = 54000

    const response = await fetch(`${baseUrl}/create-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "amount": checkoutAmount,
            "receipt": "receipt#5"
        })
    });

    const order = await response.json();

    const options = {
        "key": rzrpKeyId, // Enter the Key ID generated from the Dashboard
        "amount": checkoutAmount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "RHIT",
        "description": "Test Transaction localhost",
        "image": "https://www.google.com/drive/",
        "order_id": order.id,
        "handler": function (response: any) {
            alert(response.razorpay_payment_id);
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)
        },
        "prefill": {
            "name": "AslamGaru", //your customer's name
            "email": "aslam@example.com",
            "contact": "9000090001"  //Provide the customer's phone number for better conversion rates 
        },
        // "notes": {
        //     "location": "localhost"
        // },
        "theme": {
            "color": "#f8e1a8"
        }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();

}
