import { useRecoilValue, useSetRecoilState } from "recoil"
import { allOrdersAtom } from "../store/atoms/orderAtoms"
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firebaseCore } from "../lib/firebaseCore";
import { useEffect } from "react";
import { userAtom } from "../store/atoms/authAtoms";
import toast from "react-hot-toast";

export const useOrdersListener = () => {
    const setOrders = useSetRecoilState(allOrdersAtom);
    const userId = useRecoilValue(userAtom)!.id;

    useEffect(() => {
        if (!userId) return;

        const db = firebaseCore.db

        const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'))

        const unSubscribe = onSnapshot(q, async (snapshot) => {
            try {
                const ordersPromises = snapshot.docs.map(async doc => {
                    const itemsQ = query(collection(db, 'orders', doc.id, 'orderItems'))
                    const itemSnaps = await getDocs(itemsQ)

                    const orderItems: OrderItem[] = itemSnaps.docs.map(item => item.data() as OrderItem)

                    return {
                        ...doc.data(),
                        'orderItems': orderItems
                    } as Order
                })

                const orders = await Promise.all(ordersPromises);

                setOrders(orders)
            } catch (e) {
                toast.error("Failed fetching your orders")
            }
        })

        return () => unSubscribe()
    }, [setOrders, userId])
}