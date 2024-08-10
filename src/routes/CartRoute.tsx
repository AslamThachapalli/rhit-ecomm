import { Button, Typography } from "@material-tailwind/react";
import { useRecoilValue } from "recoil";
import { cartAtom } from "../store/atoms/cartAtoms";

export default function CartRoute() {
    const cart = useRecoilValue(cartAtom);
    console.log('cart', cart);

    return (
        <>
            <Typography variant="h2" className="flex justify-center mt-4">Cart</Typography>
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
                </div>

                <div className="col-span-4 mx-4">
                    <div className="w-full border rounded border-black p-3">
                        <Typography variant="lead" className="mb-2">
                            Cart Summary
                        </Typography>

                        <div className="flex justify-between">
                            <Typography>Price</Typography>
                            <Typography>33,444</Typography>
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

                        <Button color="teal" fullWidth className="mt-6">Checkout</Button>
                    </div>
                </div>
            </div>
        </>
    )
}