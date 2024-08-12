import { atom, selector } from "recoil";
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