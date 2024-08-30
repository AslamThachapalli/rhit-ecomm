import { atom, selectorFamily } from "recoil";

export const allOrdersAtom = atom<Order[]>({
    key: 'allOrdersAtom',
    default: []
})

export const getOrderAtom = selectorFamily({
    key: "getOrderAtomSelector",
    get: id => ({ get }) => {
        const allOrders = get(allOrdersAtom)

        return allOrders.find(order => order.id == id)
    }
})