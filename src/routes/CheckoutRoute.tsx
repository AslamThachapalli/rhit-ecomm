import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Typography
} from "@material-tailwind/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { addressAtom } from "../store/atoms/addressAtoms";
import { cartAtom, cartPriceAtom } from "../store/atoms/cartAtoms";
import { useEffect, useState } from "react";
import {
    PencilSquareIcon,
    PlusIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/solid"
import AddNewAddressForm from "../components/AddNewAddressForm";
import { baseUrl, rzrpKeyId } from "../lib/global.vars";
import { v4 as uuid } from "uuid";
import { userAtom } from "../store/atoms/authAtoms";
import { createOrder } from "../data/orderData";
import { allOrdersAtom } from "../store/atoms/orderAtoms";
import { useNavigate } from "react-router-dom";

let selectedAddressId = '';

export default function CheckoutRoute() {
    return (
        <div className="mx-auto mt-10 lg:max-w-screen-xl px-6 py-3">
            <Typography variant="h2" className="flex justify-center mt-4">Checkout</Typography>

            <hr className="my-4" />

            <AddressSection />

            <hr className="my-4" />

            <OrderSummarySection />
        </div>
    )
}

function AddressSection() {
    const addresses = useRecoilValue(addressAtom)

    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [newAddress, setNewAddress] = useState<{ add: boolean, currentAddress?: Address }>({
        add: false
    })

    useEffect(() => {
        let defaultAddress = addresses.find((address) => address.isDefault)

        if (!defaultAddress) {
            defaultAddress = addresses[0]
        }

        selectedAddressId = defaultAddress.id;
        setSelectedAddress(defaultAddress.id)
    }, [])

    function selectAddress(id: string) {
        selectedAddressId = id;
        setSelectedAddress(id)
    }

    return (
        <>
            <Typography>Delivery Address</Typography>

            {
                newAddress.add ?
                    <AddNewAddressForm
                        onCancel={() => setNewAddress({
                            add: false,
                        })}
                        onSaved={() => setNewAddress({
                            add: false
                        })}
                        onSaveError={(message) => console.log('save error', message)}
                        address={newAddress.currentAddress}
                    />
                    :
                    <div className="grid grid-cols-2 gap-4">
                        {
                            addresses.map((address) => {
                                return <div
                                    key={address.id}
                                    className={`group font-bold border h-40 rounded p-4 hover:border-gray-900 flex flex-col justify-between ${selectedAddress == address.id ? "border-gray-900" : "border-gray-300"}`}
                                    onClick={() => selectAddress(address.id)}
                                >
                                    <div>
                                        <div className="flex justify-between">
                                            <Typography variant="h6">{address.name}</Typography>
                                            <div className="text-yellow-800">{address.isDefault && 'Default'}</div>
                                        </div>
                                        <Typography variant="h6">
                                            {address.phone}
                                        </Typography>
                                        <Typography variant="small" className="pt-2">
                                            {`${address.address} ${address.city} ${address.pincode}`}
                                        </Typography>
                                    </div>

                                    <div className="flex">
                                        <PencilSquareIcon
                                            className="h-6 invisible group-hover:visible cursor-pointer"
                                            onClick={() => setNewAddress({
                                                add: true,
                                                currentAddress: address,
                                            })}
                                        />
                                    </div>
                                </div>
                            })
                        }

                        <div onClick={() => setNewAddress({
                            add: true,
                        })} className="border border-gray-300 h-40 rounded flex flex-col justify-center items-center hover:border-gray-900 text-gray-400 hover:text-gray-900 hover:cursor-pointer">
                            <PlusIcon className="h-8 w-8" />
                            <Typography variant="paragraph" color="gray">
                                Add a new address
                            </Typography>
                        </div>
                    </div>
            }
        </>
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

function OrderSummarySection() {
    const cart = useRecoilValue(cartAtom)!
    const subTotal = useRecoilValue(cartPriceAtom)!
    const user = useRecoilValue(userAtom)!
    const [_, setAllOrders] = useRecoilState(allOrdersAtom)
    const navigate = useNavigate()

    const [paymentFailed, setPaymentFailed] = useState(false);

    const cartItems = cart.cartItems

    async function displayRazorpay() {

        const updateAllOrders = (order: Order) => {
            console.log('updating all orders with:', order)
            setAllOrders((allOrders) => {
                return [order, ...allOrders];
            })
        }

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razropay failed to load!!')
            return
        }

        const checkoutAmount: number = subTotal * 100
        const receiptId: string = uuid()

        const response = await fetch(`${baseUrl}/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "amount": checkoutAmount,
                "receipt": receiptId
            })
        });

        const order = await response.json();

        console.group('pay details')
        console.log('orderId', order.id)
        console.log('receiptId', receiptId)
        console.groupEnd()

        let orderObject: Partial<Order> = {
            id: receiptId,
            addressId: selectedAddressId,
            providerOrderId: order.id,
            status: 'pending',
            totalAmount: checkoutAmount,
            userId: user.id,
            orderItems: cartItems.map((item) => {
                return {
                    'productId': item.productId,
                    'price': item.price,
                    'quantity': item.quantity,
                }
            }),
        };

        const options = {
            "key": rzrpKeyId,
            "amount": checkoutAmount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "RHIT",
            "description": "Test Transaction localhost",
            "image": "https://www.google.com/drive/",
            "order_id": order.id,
            "handler": function (response: any) {

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

                validatePayment().then(isValid => {
                    if (isValid) {
                        orderObject.paymentId = response.razorpay_payment_id;
                        orderObject.status = 'paid';
                        console.log('validated')

                        createOrder(orderObject).then(order => {
                            updateAllOrders(order);
                            navigate('/order-success/' + orderObject.id)
                        })

                    } else {
                        orderObject.paymentId = response.razorpay_payment_id;
                        orderObject.status = 'unverified';

                        console.log('unverified')

                        createOrder(orderObject).then(updateAllOrders)
                    }
                })


                console.group('pay Success')
                console.log('paymentId', response.razorpay_payment_id);
                console.log('orderID', response.razorpay_order_id);
                console.log('signature', response.razorpay_signature)
                console.groupEnd()
            },
            "prefill": {
                "name": user.firstname,
                "email": user.email,
            },
            "modal": {
                "ondismiss": function () {
                    orderObject.status = 'cancelled';
                    orderObject.paymentId = 'cancelled';

                    createOrder(orderObject).then(updateAllOrders);
                }
            },
            'retry': {
                'enabled': false,
            },
            // "notes": {
            //     "location": "localhost"
            // },
            "theme": {
                "color": "#029688"
            }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

        paymentObject.on('payment.failed', function (response: any) {
            orderObject.paymentId = response.error.metadata.payment_id;
            orderObject.status = 'failed';

            createOrder(orderObject).then(updateAllOrders)

            setPaymentFailed(true)
        })
    }

    return (
        <>
            <Dialog open={!paymentFailed} handler={() => { }} size="sm">
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Payment Failed!
                    </Typography>
                </DialogHeader>
                <DialogBody divider className="grid place-items-center gap-4">
                    <ExclamationTriangleIcon color="red" className="h-10 w-10" />
                    <Typography color="red" variant="h4">
                        Retry Payment!
                    </Typography>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button variant="text" color="blue-gray" onClick={() => setPaymentFailed(false)}>
                        close
                    </Button>
                    <Button variant="gradient" onClick={async () => {
                        setPaymentFailed(true)

                        // await new Promise((resolve) => setTimeout(() => resolve, 1000))
                        displayRazorpay()
                    }}>
                        Try Again
                    </Button>
                </DialogFooter>
            </Dialog>

            <Typography>Order Summary</Typography>

            <div className="mx-auto lg:max-w-screen-xl my-4 grid grid-cols-12">
                <div className="col-span-8 mx-4">


                    {
                        cartItems?.map((item) => {
                            return <div key={item.productId} className="grid grid-cols-10">
                                <div className="col-span-4 flex space-x-2">
                                    <div>{item.productId}</div>

                                </div>

                                <div className="col-span-2 flex justify-center">
                                    {item.price}
                                </div>

                                <div className="col-span-2 flex justify-center space-x-2">

                                    <div>{`x ${item.quantity}`}</div>

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
                            Price Details
                        </Typography>

                        <div className="flex justify-between">
                            <Typography>{"Subtotal"}</Typography>
                            <Typography>{`${subTotal}`}</Typography>
                        </div>

                        <div className="flex justify-between">
                            <Typography>Delivery Charges</Typography>
                            <Typography>20</Typography>
                        </div>

                        <hr className="my-2 bg-black/50" />

                        <div className="flex justify-between">
                            <Typography variant="h6">Amount Payable</Typography>
                            <Typography>20</Typography>
                        </div>

                        <Button color="teal" fullWidth className="mt-6" onClick={() => { displayRazorpay() }}>Place Order</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

