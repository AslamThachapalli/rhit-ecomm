import { atom, selector, selectorFamily } from "recoil";
import { userAtom } from "./authAtoms";
import { getAllOrders } from "../../data/orderData";

export const allOrdersAtom = atom<Order[]>({
    key: 'allOrdersAtom',
    default: selector({
        key: 'allOrdersAtomSelector',
        get: async ({ get }) => {
            const user = get(userAtom);

            if (!user) return []

            const allOrders = await getAllOrders(user.id);
            console.log('allOrders', allOrders)
            return allOrders
        }
    })
})

export const getOrderAtom = selectorFamily({
    key: "getOrderAtomSelector",
    get: id => ({ get }) => {
        const allOrders = get(allOrdersAtom)
        console.log('getOrderAtomSelector', allOrders)

        return allOrders.find(order => order.id == id)
    }
})