import { Button, Card, Typography } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { getOrderAtom } from "../store/atoms/orderAtoms";

export default function OrderSuccessRoute() {
    const { orderId } = useParams();
    const order = useRecoilValue(getOrderAtom(orderId))

    return (
        <div className="mx-auto mt-10 lg:max-w-screen-xl px-6 py-3">
            <Typography variant="h2" className="flex justify-center mt-4">Complete!</Typography>

            <Card>
                <div>
                    <Typography>Thank You!</Typography>
                    <Typography>Your order has been received</Typography>
                    <Typography>{`OrderId: ${order?.id}`}</Typography>
                    <Button>Purchase History</Button>
                </div>
            </Card>
        </div>
    )
}