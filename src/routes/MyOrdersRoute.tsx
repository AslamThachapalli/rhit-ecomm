import { useRecoilValue } from "recoil"
import { allOrdersAtom } from "../store/atoms/orderAtoms"
import {
    Card,
    Typography,
} from "@material-tailwind/react"
import { useOrdersListener } from "../hooks/useOrdersListener"
import { ViewOrderSnapshot } from "../components/ViewOrderSnapshot"
import { useNavigate } from "react-router-dom"
import EmptyOrders from "../components/EmptyOrders"

export default function MyOrdersRoute() {
    const navigate = useNavigate()
    useOrdersListener()

    const allOrders = useRecoilValue(allOrdersAtom);

    return (
        allOrders.length == 0 ?
            <Card className="p-8 lg:p-14">
                <EmptyOrders />
            </Card>
            :
            <Card className="p-14 min-h-[75vh]">
                <div className="divide-dashed divide-y-2 divide-gray-500 -mt-4">
                    {
                        allOrders.map(order => {
                            return <div className="divide-y pb-4">
                                <ViewOrderSnapshot order={order} isOrderDetailPage={false} navigate={navigate} />
                                <div className="flex justify-end pt-2">
                                    <div>
                                        <div className="min-w-64 grid grid-cols-2 gap-4">
                                            <Typography>
                                                quantity
                                            </Typography>
                                            <Typography className="place-self-end">{order.quantity}</Typography>
                                        </div>
                                        <div className="min-w-64 grid grid-cols-2 gap-4">
                                            <Typography>
                                                Total
                                            </Typography>
                                            <Typography className="place-self-end">{order.totalAmount}</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </Card>
    )
}


