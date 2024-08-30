import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil";
import { getOrderAtom } from "../store/atoms/orderAtoms";
import { Button, Card, Typography, Stepper, Step, Dialog, DialogBody, DialogHeader, DialogFooter } from "@material-tailwind/react";
import { ViewOrderSnapshot } from "../components/ViewOrderSnapshot";
import {
    CogIcon,
    UserIcon,
    BuildingLibraryIcon,
    DocumentDuplicateIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { addressFromIdAtom } from "../store/atoms/addressAtoms";

export default function OrderDetailRoute() {
    const { id } = useParams();
    const order = useRecoilValue(getOrderAtom(id));
    const address = useRecoilValue(addressFromIdAtom(order?.addressId))
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(false)
    }

    if (!order) {
        return (
            <div>Order Not Found</div>
        )
    }

    return (
        <div className="flex flex-col space-y-5">
            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>Track Order</DialogHeader>
                <DialogBody>
                    <div>
                        <span>Copy the order ID to track you order </span>
                        <div className="flex flex-row items-center space-x-2 text-teal-700 font-medium">
                            <div className="">{order.deliveryId}</div>
                            <DocumentDuplicateIcon
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => navigator.clipboard.writeText(`${order.deliveryId}`)}
                            />
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="teal"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button 
                    variant="gradient" 
                    color="teal" 
                    onClick={() => window.open("https://rhit.shiprocket.co/tracking", "_blank")}
                    >
                        <span>Copied!</span>
                    </Button>
                </DialogFooter>
            </Dialog>
            <Card className="p-14">
                <div>
                    <div className="flex justify-between items-start">
                        <Typography variant="h5">Order Details</Typography>
                        <Button variant="text" color="blue" size="sm" onClick={() => setOpen(true)}>Track Order</Button>
                    </div>

                    <StepperWithContent />
                </div>

                <ViewOrderSnapshot
                    order={order}
                    isOrderDetailPage={true}
                />

                <Button
                    variant="text"
                    fullWidth
                    color="teal"
                    className="-mb-4"
                >Return Item</Button>
            </Card>

            <div className="grid grid-cols-5 gap-5">
                <Card className="px-14 py-8 col-span-3">
                    <div>
                        <Typography>Shipping Information</Typography>
                        <hr className="my-2" />
                        <div className="grid grid-cols-6">
                            <div className="col-span-1 text-sm font-thin">Name:</div>
                            <div className="col-span-5">{address?.name}</div>
                        </div>
                        <div className="grid grid-cols-6">
                            <div className="col-span-1 text-sm font-thin">Phone:</div>
                            <div className="col-span-5">{address?.phone}</div>
                        </div>
                        <div className="grid grid-cols-6">
                            <div className="col-span-1 text-sm font-thin">Address:</div>
                            <div className="col-span-5">{address?.address + ", " + address?.city + ", " + address?.state + ", " + address?.pincode}</div>
                        </div>
                    </div>
                </Card>
                <Card className="px-14 py-8 col-span-2">
                    <div>
                        <Typography>Payment Detail</Typography>
                        <hr className="my-2" />
                        <div className="grid grid-cols-6">
                            <div className="col-span-3 text-sm font-thin">Total quantity:</div>
                            <div className="col-span-3">{order.quantity}</div>
                        </div>
                        <div className="grid grid-cols-6">
                            <div className="col-span-3 text-sm font-thin">Items subtotal:</div>
                            <div className="col-span-3">{order.totalAmount}</div>
                        </div>
                        <hr className="my-2" />
                        <div className="grid grid-cols-6">
                            <div className="col-span-3 text-sm font-thin">Total:</div>
                            <div className="col-span-3">{order.totalAmount}</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

function StepperWithContent() {
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);

    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    return (
        <div className="w-full px-24 py-4">
            <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
            >
                <Step onClick={() => setActiveStep(0)}>
                    <UserIcon className="h-5 w-5" />
                    <div className="absolute -bottom-[4.5rem] w-max text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 0 ? "blue-gray" : "gray"}
                        >
                            Step 1
                        </Typography>
                        <Typography
                            color={activeStep === 0 ? "blue-gray" : "gray"}
                            className="font-thin text-sm"
                        >
                            Details about yout account.
                        </Typography>
                    </div>
                </Step>
                <Step onClick={() => setActiveStep(1)}>
                    <CogIcon className="h-5 w-5" />
                    <div className="absolute -bottom-[4.5rem] w-max text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 1 ? "blue-gray" : "gray"}
                        >
                            Step 2
                        </Typography>
                        <Typography
                            color={activeStep === 1 ? "blue-gray" : "gray"}
                            className="font-thin text-sm"
                        >
                            Details about yout account.
                        </Typography>
                    </div>
                </Step>
                <Step onClick={() => setActiveStep(2)}>
                    <BuildingLibraryIcon className="h-5 w-5" />
                    <div className="absolute -bottom-[4.5rem] w-max text-center">
                        <Typography
                            variant="h6"
                            color={activeStep === 2 ? "blue-gray" : "gray"}
                        >
                            Step 3
                        </Typography>
                        <Typography
                            color={activeStep === 2 ? "blue-gray" : "gray"}
                            className="font-thin text-sm"
                        >
                            Details about yout account.
                        </Typography>
                    </div>
                </Step>
            </Stepper>
            <div className="mt-24 flex justify-between">
                {/* <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button> */}
            </div>
        </div>
    );
}