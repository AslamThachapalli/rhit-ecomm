import { atom, selector } from "recoil";
import { Nullable } from "../../lib/globals";
import { currentUser } from "../../data/authData";

export const userAtom = atom<Nullable<AppUser>>({
  key: "userAtom",
  default: selector({
    key: 'userAtomSelector',
    get: async () => {
      await new Promise(res => setTimeout(res, 1000));
      const user = await currentUser()
      return user;
    }
  }),
});