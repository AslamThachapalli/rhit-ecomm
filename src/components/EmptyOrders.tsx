import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

const EmptyOrders = () => {
    const count = useMotionValue(50)
    const rounded = useTransform(count, Math.round)

    useEffect(() => {
        animate(count, 0, {
            duration: 1
        })
    }, [])

    return (
        <div className="p-14 w-full flex flex-col justify-center items-center gap-4 min-h-[36vh] lg:min-h-[70vh] text-blue-gray-300">
            <h1 className="font-black text-2xl lg:text-5xl text-center">You have</h1>
            <motion.h1 className="font-black text-7xl">{rounded}</motion.h1>
            <h1 className="font-black text-2xl lg:text-5xl text-center">Orders Placed</h1>
        </div>
    )
}

export default EmptyOrders