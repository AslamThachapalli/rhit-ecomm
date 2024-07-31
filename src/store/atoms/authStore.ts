import { atom, selector } from "recoil";
import { Nullable } from "../../lib/globals";
import { firebaseCore } from "../../lib/firebaseCore";

export const userState = atom<Nullable<AppUser>>({
  key: "userState",
  default: selector({
    key: 'userStateSelector',
    get: async () => {
      console.log('selector')
      await new Promise(res => setTimeout(res, 1000));
      const user = await firebaseCore.currentUser()
      console.log('current user', user);
      return user;
    }
  }),
});