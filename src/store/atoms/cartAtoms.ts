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

export const cartCountAtom = selector({
    key: 'cartCountAtomSelector',
    get: ({get}) =>{
        const cart = get(cartAtom)
        if(!cart) return null;

        return cart.quantity;
    }
})

export const cartPriceAtom = selector<Nullable<number>>({
    key: 'cartPriceAtomSelector',
    get: ({get}) => {
        const cart = get(cartAtom)

        let price: number = 0
        cart?.cartItems.forEach((item) => {
            price += (item.price * item.quantity)
        })

        return price
    }
})