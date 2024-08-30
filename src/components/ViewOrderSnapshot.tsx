import { Chip, Typography } from "@material-tailwind/react";
import { NavigateFunction } from "react-router-dom";

export function ViewOrderSnapshot({ order, isOrderDetailPage, navigate }: { order: Order, isOrderDetailPage: boolean, navigate?: NavigateFunction }) {

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
            case 'failed':
            case 'refund failed': {
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
            case 'unverified':
            case 'pending': {
                return {
                    color: 'orange',
                    iconColor: 'bg-orange-900'
                }
            }
            case 'refunded':
            case 'refund initiated': {
                return {
                    color: 'teal',
                    iconColor: 'bg-teal-900'
                }
            }
        }
    }

    var orderedDate = new Date(order.createdOn).toLocaleDateString('en-GB');
    return (
        <div key={order.id} className="divide-y py-4">
            <div className="flex justify-between items-start pb-2">
                <div>
                    <div className="flex">
                        <Typography variant="small">Order No:&nbsp;</Typography>
                        <Typography
                            variant="small"
                            className={!isOrderDetailPage ? "cursor-pointer text-teal-500" : ""}
                            onClick={() => {
                                if (!isOrderDetailPage && navigate) {
                                    navigate(`/account/my-orders/${order.id}`)
                                }
                            }}
                        >
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
        </div>
    )
}