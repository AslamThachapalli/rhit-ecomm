import { atom, selector, selectorFamily } from "recoil";
import { userAtom } from "./authAtoms";
import { getAllAddress } from "../../data/addressData";

export const addressAtom = atom<Address[]>({
    key: "addressAtom",
    default: selector({
        key: "addressAtomSelector",
        get: async ({get}) => {
            const user = get(userAtom)
            if(!user) return []

            return await getAllAddress(user.id);
        }
    })
})

export const addressFromIdAtom = selectorFamily({
    key: "addressFromIdAtomSelector",
    get: id => ({ get }) => {
        const allAddress = get(addressAtom);

        return allAddress.find(address => address.id == id)
    }
})