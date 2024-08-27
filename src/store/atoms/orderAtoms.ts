import { atom, selectorFamily } from "recoil";

export const allOrdersAtom = atom<Order[]>({
    key: 'allOrdersAtom',
    default: []
})

export const getOrderAtom = selectorFamily({
    key: "getOrderAtomSelector",
    get: id => ({ get }) => {
        const allOrders = get(allOrdersAtom)

        if(Array.isArray(allOrders)){
            return allOrders.find(order => order.id == id)
        }
        return undefined
    }
})