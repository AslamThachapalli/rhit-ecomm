import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { createOrder, updateOrder } from "../data/orderData";
import { baseUrl, rzrpKeyId } from "../lib/global.vars";
import { v4 as uuid } from "uuid";
import { SetterOrUpdater } from "recoil";
import { NavigateFunction } from "react-router-dom";

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

interface PaymentProps {
    amountPayable: number;
    orderSetter: SetterOrUpdater<Order[]>;
    addressId: string;
    user: AppUser;
    cart: Cart;
    navigate: NavigateFunction;
}

export async function initiatePayment({ amountPayable, orderSetter, addressId, user, cart, navigate }: PaymentProps) {

    const updateOrderState = async (orderObject: Partial<Order>) => {
        try {
            await updateOrder(orderObject)
        } catch (e) {
            toast.error("Failed updating your order status. Please contact support.")
        }
    }

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
        toast.error('Razropay failed to load!!')
        return
    }

    const checkoutAmount: number = amountPayable * 100
    const receiptId: string = uuid()
    const orderItems: OrderItem[] = cart.cartItems.map((item) => {
        return {
            'productId': item.productId,
            'price': item.price,
            'quantity': item.quantity,
        }
    })

    let response: any

    try {
        response = await fetch(`${baseUrl}/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "amount": checkoutAmount,
                "receipt": receiptId,
            })
        });
    } catch (e) {
        toast.error("Failed to create payment order in server.")
        return
    }

    const order = await response.json();

    let orderObject: Partial<Order> = {
        id: receiptId,
        addressId: addressId,
        providerOrderId: order.id,
        status: 'pending',
        totalAmount: checkoutAmount,
        userId: user.id,
        quantity: cart.quantity,
        orderItems: orderItems,
    };

    try {
        const order = await createOrder(orderObject)
        orderSetter((allOrders) => {
            return [order, ...allOrders];
        })
    } catch (e) {
        toast.error("Failed to process your order request.")
        return
    }

    const options = {
        "key": rzrpKeyId,
        "amount": checkoutAmount,
        "currency": "INR",
        "name": "RHIT",
        "description": "Test Transaction localhost",
        // "image": "https://www.google.com/drive/",
        "order_id": order.id,
        "handler": async function (response: any) {

            const validatePayment = async (): Promise<boolean> => {
                const verifyResponse = await fetch(`${baseUrl}/verify-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'orderId': orderObject.providerOrderId,
                        'paymentId': response.razorpay_payment_id,
                        'signature': response.razorpay_signature,
                    })
                })

                const value = await verifyResponse.json();

                return value.isValid as boolean;
            }

            try {
                const isValid = await validatePayment()

                if (isValid) {
                    navigate('/order-success/' + orderObject.id)
                } else {
                    orderObject.paymentId = response.razorpay_payment_id;
                    orderObject.status = 'unverified';
                    orderObject.failedOn = Date.now();

                    updateOrderState(orderObject)

                    toast.error("Detected payment as Invalid")
                }
            } catch {
                toast.error("Failed validating order from server. Please contact support")
            }
        },
        "prefill": {
            "name": user.firstname,
            "email": user.email,
        },
        "modal": {
            "ondismiss": function () {
                orderObject.status = 'cancelled';
                orderObject.paymentId = 'cancelled';
                orderObject.cancelledOn = Date.now();

                updateOrderState(orderObject)
            }
        },
        "notes": {
            receiptId,
        },
        'retry': {
            'enabled': false,
        },
        "theme": {
            "color": "#029688"
        }
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();

    paymentObject.on('payment.failed', function () {
        paymentFailedToast({ amountPayable, orderSetter, addressId, user, cart, navigate })
    })
}

const paymentFailedToast = (props: PaymentProps) => toast.custom((t) => (
    <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <ExclamationTriangleIcon color="red" className="h-10 w-10" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        Uh ooh! Payment Failed :(
                    </p>
                </div>
            </div>
        </div>
        <div className="flex border-l border-gray-200">
            <button
                onClick={() => {
                    toast.dismiss(t.id)
                    initiatePayment(props)
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-teal-600 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
                Try Again
            </button>
        </div>
    </div>
));