import { User } from "firebase/auth";
import { atom } from "recoil";
import { Nullable } from "../../lib/global";

export const userState = atom<Nullable<User>>({
  key: "userState",
  default: null,
});