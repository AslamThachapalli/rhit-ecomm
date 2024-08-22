import { useRecoilValueLoadable } from "recoil"
import { allOrdersAtom } from "../store/atoms/orderAtoms"
import {
    Card,
    Chip,
    Typography
} from "@material-tailwind/react"

export default function MyOrdersRoute() {
    const allOrders = useRecoilValueLoadable(allOrdersAtom)

    const getChipColor = (status: OrderStatus): {
        color: "gray" | "red" | "green" | "orange" | "teal",
        iconColor: 'bg-gray-900' | 'bg-red-900' | 'bg-green-900' | 'bg-orange-900' | 'bg-teal-900'
    } => {
        switch (status) {
            case 'cancelled': {
                return {
                    color: 'gray',
                    iconColor: 'bg-gray-900'
                }
            }
            case 'failed': {
                return {
                    color: 'red',
                    iconColor: 'bg-red-900'
                }
            }
            case 'paid': {
                return {
                    color: 'green',
                    iconColor: 'bg-green-900'
                }
            }
            case 'unverified': {
                return {
                    color: 'orange',
                    iconColor: 'bg-orange-900'
                }
            }
            case 'pending': {
                return {
                    color: 'teal',
                    iconColor: 'bg-teal-900'
                }
            }
        }
    }

    switch (allOrders.state) {
        case "loading": {
            return (
            <Card className="p-14 min-h-[75vh]">
                <div>Loading</div>
            </Card>
            )
        }
        case "hasError": {
            return (
            <Card className="p-14 min-h-[75vh]">
                <div>Failed loading your orders</div>
            </Card>
            )
        }
        case "hasValue": {
            return (
                <Card className="p-14 min-h-[75vh]">
                    <div className="divide-dashed divide-y-2 divide-gray-500 -mt-4">
                        {
                            allOrders.contents.map(order => {
                                var orderedDate = new Date(order.createdAt).toLocaleDateString('en-GB');

                                return <div key={order.id} className="divide-y py-4">
                                    <div className="flex justify-between items-start pb-2">
                                        <div>
                                            <div className="flex">
                                                <Typography variant="small">Order No:&nbsp;</Typography>
                                                <Typography
                                                    variant="small"
                                                    className="cursor-pointer text-teal-500" >
                                                    {order.id}
                                                </Typography>

                                            </div>
                                            <Typography variant="small">{`Order On: ${orderedDate}`}</Typography>
                                        </div>
                                        <Chip
                                            variant="ghost"
                                            color={getChipColor(order.status).color}
                                            size="sm"
                                            value={order.status}
                                            icon={
                                                <span className={`mx-auto mt-1 block h-2 w-2 rounded-full content-[''] ${getChipColor(order.status).iconColor}`} />
                                            }
                                        />
                                    </div>

                                    <div className="py-2 grid gap-1">
                                        {
                                            order.orderItems.map(item => {
                                                return <div key={item.productId} className="grid grid-cols-12">
                                                    <Typography variant="h6" className="col-span-8">
                                                        {item.productId}
                                                    </Typography>
                                                    <Typography className="col-span-3">
                                                        {item.price}
                                                    </Typography>
                                                    <Typography className="col-span-1">
                                                        {`x ${item.quantity}`}
                                                    </Typography>
                                                </div>
                                            })
                                        }
                                    </div>

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
    }
}