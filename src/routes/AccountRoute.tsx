import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    List,
    ListItem,
    ListItemPrefix,
    ThemeProvider,
} from "@material-tailwind/react";
import {
    UserIcon,
    MapPinIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { firebaseCore } from "../lib/firebaseCore";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";

const theme = {
    list: {
        styles: {
            base: {
                item: {
                    selected: {
                        bg: "bg-blue-gray-400",
                        color: "text-white",
                    },
                }
            }
        },
    }
}

export default function AccountRoute() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname;

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const setUser = useSetRecoilState(userAtom);

    const [selectedIndex, setSelectedIndex] = useState(currentPath === '/account/address' ? 2 : 1);

    const cancelLogout = () => setShowLogoutDialog(false);

    const signOutUser = () => {
        firebaseCore.signOutUser()
        navigate('/')
        setUser(null)
    }

    return (
        <ThemeProvider value={theme}>
            <Dialog size="xs" open={showLogoutDialog} handler={cancelLogout}>
                <DialogBody>Confirm to logout?</DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="teal"
                        onClick={cancelLogout}
                        className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="teal"
                        onClick={signOutUser}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            <div className="grid grid-cols-5 mx-auto mt-10 lg:max-w-screen-xl w-11/12 px-6 py-3" >
                <div className="col-span-1">
                    <List className="pe-10" >
                        <ListItem selected={selectedIndex === 1} onClick={() => {
                            navigate('/account')
                            setSelectedIndex(1)
                        }} className=" hover:bg-blue-gray-200 hover:text-white focus:bg-blue-gray-500 focus:text-white">
                            <ListItemPrefix>
                                <UserIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            My Profile
                        </ListItem>
                        <ListItem selected={selectedIndex === 2} onClick={() => {
                            navigate('/account/address')
                            setSelectedIndex(2)
                        }} className="hover:bg-blue-gray-200 hover:text-white focus:bg-blue-gray-500 focus:text-white">
                            <ListItemPrefix>
                                <MapPinIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Addresses
                        </ListItem>
                        <hr className="bg-black/30 h-0.5" />
                        <ListItem onClick={() => setShowLogoutDialog(true)} className="hover:bg-blue-gray-200 hover:text-white">
                            <ListItemPrefix>
                                <PowerIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Log Out
                        </ListItem>
                    </List>
                </div >
                <div className="col-span-4">
                    <Outlet />
                </div>
            </div>
        </ThemeProvider>
    )
}