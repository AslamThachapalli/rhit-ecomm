import { Button } from "@material-tailwind/react";
import Razorpay from "razorpay";
import { baseUrl, rzrpKeyId } from "../lib/global.vars";

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

export default function HomeRoute() {

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

    return (
        <div className="text-lg">
            <Button onClick={() => {
                displayRazorpay();
            }}>Checkout</Button>
        </div>
    )
}