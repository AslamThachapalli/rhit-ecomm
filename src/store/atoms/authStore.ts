import { atom, selector } from "recoil";
import { Nullable } from "../../lib/globals";
import { firebaseCore } from "../../lib/firebaseCore";

export const userState = atom<Nullable<AppUser>>({
  key: "userAtom",
  default: selector({
    key: 'userAtomSelector',
    get: async () => {
      await new Promise(res => setTimeout(res, 1000));
      const user = await firebaseCore.currentUser()
      return user;
    }
  }),
});