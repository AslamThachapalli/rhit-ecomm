import {
    Badge,
    Button
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
import { allProductsAtom } from "../store/atoms/productAtoms";
import { Nullable } from "../lib/globals";
import { formatToPrice } from "../lib/formatters";

let selectedAddressId = '';

export default function CheckoutRoute() {
    return (
        <div className="mx-auto pt-24 px-6 min-h-screen lg:max-w-screen-xl">
            <div className="font-black text-4xl lg:text-6xl">Checkout</div>

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
            <h2 className="font-bold text-xl mb-4">Delivery Address</h2>

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
                    <div className="grid lg:grid-cols-2 gap-4">
                        {
                            addresses.map((address) => {
                                return <div
                                    key={address.id}
                                    className={`${selectedAddress == address.id ? "border-gray-900 border-2" : "border-gray-300"} 
                                    group card-gradient border h-40 rounded p-4 hover:border-gray-900 flex flex-col justify-between`}
                                    onClick={() => selectAddress(address.id)}
                                >
                                    <div>
                                        <div className="flex justify-between">
                                            <h1 className="font-bold">{address.name}</h1>
                                            <div className="text-orange-900">{address.isDefault && 'Default'}</div>
                                        </div>
                                        <h2 className="font-semibold">{address.phone}</h2>
                                        <p className="pt-2">
                                            {`${address.address} ${address.city} ${address.pincode}`}
                                        </p>
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
                            className="border card-gradient border-gray-300 h-40 rounded flex flex-col justify-center items-center hover:border-gray-900 text-blue-gray-500 hover:text-black hover:cursor-pointer"
                        >
                            <PlusIcon className="h-8 w-8" />
                            <p>Add a new address</p>
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
    const allProducts = useRecoilValue(allProductsAtom)

    const navigate = useNavigate()

    const cartItems = cart.cartItems

    let products = cartItems?.map((item) => {
        return allProducts.find((product) => product.id === item.productId)
    })

    const getProduct = (id: string): Nullable<Product> => {
        return products?.find(item => item?.id == id)
    }

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
            <h2 className="font-bold text-xl mb-4">Order Summary</h2>

            <div className="mx-auto lg:max-w-screen-xl my-4 grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 flex flex-col gap-4">
                    {
                        cartItems?.map((item, index) => {
                            const product = getProduct(item.productId);

                            return <div
                                key={`checkoutItem-${index}`}
                                className="flex justify-between items-center gap-5 sm:gap-10 lg:gap-20 card-gradient p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                            >

                                <Badge
                                    content={item.quantity}
                                    withBorder
                                    color="indigo"
                                >
                                    <img
                                        src={product?.mainImg}
                                        alt={product?.heading}
                                        className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-md bg-white p-2"
                                    />
                                </Badge>

                                <h1 className="font-bold text-sm md:text-xl text-ellipsis flex-1">{product?.name}</h1>

                                <h2 className="font-semibold text-sm md:text-xl">{formatToPrice(item.price * item.quantity)}</h2>
                            </div>
                        })
                    }
                </div>

                <div className="lg:col-span-4">
                    <div className="w-full rounded shadow-xl ring-1 p-3">
                        <h1 className="mb-2 font-semibold text-lg">Price Details</h1>

                        <div className="flex justify-between">
                            <p>{"Subtotal"}</p>
                            <p>{`${formatToPrice(subTotal)}`}</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Delivery Charges</p>
                            <p>₹20</p>
                        </div>

                        <hr className="my-2 bg-black/50" />

                        <div className="flex justify-between">
                            <p>Amount Payable</p>
                            <p>{formatToPrice(subTotal + 2000)}</p>
                        </div>

                        <Button fullWidth className="mt-6" onClick={pay}>Place Order</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

