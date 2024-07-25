import { atom } from "recoil";
import { Nullable } from "../../lib/globals";

export const userState = atom<Nullable<AppUser>>({
  key: "userState",
  default: null,
});