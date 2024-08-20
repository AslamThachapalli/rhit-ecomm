import { useRecoilValue } from "recoil"
import { allOrdersAtom } from "../store/atoms/orderAtoms"
import { Card } from "@material-tailwind/react"

export default function MyOrdersRoute() {
    const allOrders = useRecoilValue(allOrdersAtom)

    return (
        <Card className="p-14 min-h-[75vh]">
            {allOrders.length}
        </Card>
    )
}