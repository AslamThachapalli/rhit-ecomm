import { atom, selector } from "recoil";
import { userAtom } from "./authAtoms";
import { getCart } from "../../data/cartData";
import { Nullable } from "../../lib/globals";

export const cartAtom = atom<Nullable<Cart>>({
    key: 'cartAtom',
    default: selector({
        key: 'cartAtomSelector',
        get: async ({ get }) => {
            const user = get(userAtom);

            if (!user) return null
            
            const cart = await getCart(user.id)
            return cart
        }
    })
})

export const cartCountAtom = atom<Nullable<number>>({
    key: 'cartCountAtom',
    default: selector({
        key: 'cartCountAtomSelector',
        get: ({get}) =>{
            const cart = get(cartAtom)
            if(!cart) return null;

            return cart.quantity;
        }
    })
})