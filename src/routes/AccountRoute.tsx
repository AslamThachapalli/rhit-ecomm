import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import {
    UserIcon,
    MapPinIcon,
    PowerIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { signOutUser } from "../data/authData";

export default function AccountRoute() {
    const navigate = useNavigate()

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const setUser = useSetRecoilState(userAtom);

    const cancelLogout = () => setShowLogoutDialog(false);

    const signOut = () => {
        signOutUser()
        navigate('/')
        setUser(null)
    }

    return (
        <>
            <Dialog size="xs" open={showLogoutDialog} handler={cancelLogout}>
                <DialogBody>Confirm to logout?</DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        onClick={cancelLogout}
                        className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        onClick={signOut}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            <div className="grid lg:grid-cols-5 mx-auto pt-24 lg:max-w-screen-xl w-full px-8 py-3 gap-4" >
                <div className="lg:col-span-1">
                    <ul className="flex flex-col gap-1">
                        <li className="w-full flex cursor-pointer">
                            <NavLink
                                to={'/account/my-profile'}
                                className={({ isActive }) => `navlink ${isActive ?
                                    "text-white bg-blue-gray-400" :
                                    "text-blue-gray-600"
                                    }`}
                            >
                                <UserIcon className="h-5 w-5" />
                                My Profile
                            </NavLink>
                        </li>

                        <li className="w-full flex cursor-pointer">
                            <NavLink
                                to={'/account/address'}
                                className={({ isActive }) => `navlink ${isActive ?
                                    "text-white bg-blue-gray-400" :
                                    "text-blue-gray-600"
                                    }`}
                            >
                                <MapPinIcon className="h-5 w-5" />
                                Addresses
                            </NavLink>
                        </li>

                        <li className="w-full flex cursor-pointer">
                            <NavLink
                                to={'/account/my-orders'}
                                className={({ isActive }) => `navlink ${isActive ?
                                    "text-white bg-blue-gray-400" :
                                    "text-blue-gray-600"
                                    }`}
                            >
                                <ShoppingBagIcon className="h-5 w-5" />
                                My Orders
                            </NavLink>
                        </li>

                        <li className="w-full mt-2 flex cursor-pointer text-blue-gray-600 border-blue-gray-100 pt-1" style={{ borderTop: "solid" }}>
                            <div 
                            className="navlink"
                            onClick={() => setShowLogoutDialog(true)}
                            >
                                <PowerIcon className="h-5 w-5" />
                                Logout
                            </div>
                        </li>
                    </ul>
                </div >

                <div className="lg:col-span-4">
                    <Outlet />
                </div>
            </div>
        </>
    )
}