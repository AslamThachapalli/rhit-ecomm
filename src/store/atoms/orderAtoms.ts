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
            return allOrders
        }
    })
})

export const getOrderAtom = selectorFamily({
    key: "getOrderAtomSelector",
    get: id => ({ get }) => {
        const allOrders = get(allOrdersAtom)

        return allOrders.find(order => order.id == id)
    }
})