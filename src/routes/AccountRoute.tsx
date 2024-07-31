import {
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";
import {
    UserIcon,
    MapPinIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AccountRoute() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentPath = location.pathname;
    console.log(currentPath);
    console.log(currentPath === '/account/address')

    const [selectedIndex , setSelectedIndex] = useState(currentPath === '/account/address' ? 2 : 1);

    return (
        <div className="grid grid-cols-5 mx-auto mt-10 lg:max-w-screen-xl w-11/12 px-6 py-3" >
            <div className="col-span-1">
                <List className="pe-10">
                    <ListItem selected={selectedIndex === 1} onClick={() => {
                        navigate('/account')
                        setSelectedIndex(1)
                    }} className="text-blue-gray-700 hover:bg-blue-gray-200 hover:text-white focus-within:bg-blue-gray-500 focus:bg-blue-gray-500 focus:text-white">
                        <ListItemPrefix>
                            <UserIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        My Profile
                    </ListItem>
                    <ListItem selected={selectedIndex === 2} onClick={() => {
                        navigate('/account/address')
                        setSelectedIndex(2)
                    }} className="text-blue-gray-700 hover:bg-blue-gray-200 hover:text-white focus:bg-blue-gray-500 focus:text-white">
                        <ListItemPrefix>
                            <MapPinIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Addresses
                    </ListItem>
                    <hr className="bg-black/30 h-0.5" />
                    <ListItem className="text-blue-gray-700 hover:bg-blue-gray-200 hover:text-white">
                        <ListItemPrefix>
                            <PowerIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Log Out
                    </ListItem>
                </List>
            </div >
            <div className="col-span-4">
                <Outlet/>
            </div>
        </div>
    )
}