import { collection, doc, getDocs, orderBy, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { firebaseCore } from "../lib/firebaseCore";

const db = firebaseCore.db;

export async function createOrder(order: Partial<Order>): Promise<Order> {
    try {
        order.createdAt = Date.now()
        order.updatedAt = Date.now()

        const batch = writeBatch(db)

        const orderRef = doc(db, 'orders', order.id!)

        let orderFields = { ...order };
        delete orderFields.orderItems;

        batch.set(orderRef, orderFields);

        const collectionRef = collection(db, 'orders', order.id!, 'orderItems')

        order.orderItems?.forEach(item => {
            const docRef = doc(collectionRef, item.productId);
            batch.set(docRef, item)
        })

        await batch.commit()

        return order as Order
    } catch (e) {
        throw new Error("Failed creating order in db")
    }
}

export async function updateOrder(order: Partial<Order>){
    try{
        order.updatedAt = Date.now()
        
        await updateDoc(doc(db, "orders", order.id!), {...order})
    }catch(e){
        throw new Error("Failed updating your order status")
    }
}

export async function getAllOrders(userId: string): Promise<Order[]> {
    try {
        let orders: Order[] = []

        const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
        const querySnaps = await getDocs(q)

        const ordersPromises = querySnaps.docs.map(async doc => {
            const itemsQ = query(collection(db, 'orders', doc.id, 'orderItems'))
            const itemSnaps = await getDocs(itemsQ)

            const orderItems: OrderItem[] = itemSnaps.docs.map(item => item.data() as OrderItem)

            return {
                ...doc.data(),
                'orderItems': orderItems
            } as Order
        })

        orders = await Promise.all(ordersPromises);

        return orders
    } catch (e) {
        throw new Error("Failed fetching your orders")
    }
}