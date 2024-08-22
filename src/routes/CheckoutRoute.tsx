import {
    Button,
    Typography
} from "@material-tailwind/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { addressAtom } from "../store/atoms/addressAtoms";
import { cartAtom, cartPriceAtom } from "../store/atoms/cartAtoms";
import { useEffect, useState } from "react";
import {
    PencilSquareIcon,
    PlusIcon,
} from "@heroicons/react/24/solid"
import AddNewAddressForm from "../components/AddNewAddressForm";
import { userAtom } from "../store/atoms/authAtoms";
import { allOrdersAtom } from "../store/atoms/orderAtoms";
import { useNavigate } from "react-router-dom";
import { initiatePayment } from "../lib/payment";

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

                        <div
                            onClick={() => setNewAddress({
                                add: true,
                            })}
                            className="border border-gray-300 h-40 rounded flex flex-col justify-center items-center hover:border-gray-900 text-gray-400 hover:text-gray-900 hover:cursor-pointer"
                        >
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

function OrderSummarySection() {
    const cart = useRecoilValue(cartAtom)!
    const subTotal = useRecoilValue(cartPriceAtom)!
    const user = useRecoilValue(userAtom)!
    const [_, setAllOrders] = useRecoilState(allOrdersAtom)
    const navigate = useNavigate()

    const cartItems = cart.cartItems

    const pay = () => initiatePayment({
        addressId: selectedAddressId,
        amountPayable: subTotal,
        cart,
        navigate,
        orderSetter: setAllOrders,
        user
    })

    return (
        <>
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

                        <Button color="teal" fullWidth className="mt-6" onClick={pay}>Place Order</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

