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
    ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { signOutUser } from "../data/authData";

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
    },
    button: {
        defaultProps: {
          color: "indigo",
        },
      }
}

export default function AccountRoute() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname;

    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const setUser = useSetRecoilState(userAtom);

    const findCurrentSelectedIndex = (currentPath: string): number => {
        switch (currentPath) {
            case '/account/address': {
                return 2
            }
            case '/account/my-orders': {
                return 3
            }
            default: {
                return 1
            }
        }
    }

    const [selectedIndex, setSelectedIndex] = useState(findCurrentSelectedIndex(currentPath));

    const cancelLogout = () => setShowLogoutDialog(false);

    const signOut = () => {
        signOutUser()
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

            <div className="grid grid-cols-5 mx-auto pt-24 lg:max-w-screen-xl w-11/12 px-6 py-3" >
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
                        <ListItem selected={selectedIndex === 3} onClick={() => {
                            navigate('/account/my-orders')
                            setSelectedIndex(3)
                        }} className="hover:bg-blue-gray-200 hover:text-white focus:bg-blue-gray-500 focus:text-white">
                            <ListItemPrefix>
                                <ShoppingBagIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            My Orders
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