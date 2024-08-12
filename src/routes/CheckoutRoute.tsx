import { Button, Typography } from "@material-tailwind/react";
import { useRecoilValue } from "recoil";
import { addressAtom } from "../store/atoms/addressAtoms";
import { cartAtom, cartPriceAtom } from "../store/atoms/cartAtoms";
import { useEffect, useState } from "react";
import {
    PencilSquareIcon,
    PlusIcon
} from "@heroicons/react/24/solid"
import AddNewAddressForm from "../components/AddNewAddressForm";

export default function Checkout() {
    const cartItems = useRecoilValue(cartAtom)?.cartItems
    const subTotal = useRecoilValue(cartPriceAtom)

    return (
        <div className="mx-auto mt-10 lg:max-w-screen-xl px-6 py-3">
            <Typography variant="h2" className="flex justify-center mt-4">Checkout</Typography>

            <hr className="my-4" />

            <AddressSection />

            <hr className="my-4" />

            <Typography>Order Summary</Typography>

            <div className="flex">
                <div>
                    {
                        cartItems?.map((item) => {
                            return <div>{item.productId + " " + item.quantity}</div>
                        })
                    }
                </div>

                <div>
                    <Button>{`Place Order ${subTotal}`}</Button>
                </div>
            </div>
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

        setSelectedAddress(defaultAddress.id)
    }, [])

    function selectAddress(id: string) {
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