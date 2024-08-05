import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon, UserIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import { userState } from "../store/atoms/authStore";
import { Link, useNavigate } from "react-router-dom";
import { firebaseCore } from "../lib/firebaseCore";

function NavList() {
  const [user, setUser] = useRecoilState(userState);
  const navigate = useNavigate();

  const signOutUser = () => {
    firebaseCore.signOutUser()

    setUser(null);
  }

  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {/* Products */}
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium">
        <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
          All Products
        </a>
      </Typography>

      {/* Cart Icon */}
      <IconButton
        variant="text"
        className="h-8 w-8 text-inherit hidden lg:inline-block"
        ripple={true}
        onClick={() => navigate('/cart')}
      >
        <ShoppingCartIcon className="h-6 w-6" />
      </IconButton>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="lg:hidden inline-block p-1 font-medium">
        <Link to={'/cart'} className="flex items-center hover:text-blue-500 transition-colors">
          My Cart
        </Link>
      </Typography>

      {/* Orders */}
      {user && <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="lg:hidden inline-block p-1 font-medium">
        <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
          My Order
        </a>
      </Typography>}

      {/* Login and Account Icon */}
      {
        user ?
          <>
            <Menu placement="bottom-end">
              <MenuHandler>
                <IconButton
                  variant="text"
                  className="h-8 w-8 text-inherit hidden lg:inline-block"
                  ripple={true}
                  onClick={() => { }}
                >
                  <UserIcon className="h-6 w-6" />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => navigate('/account')}>
                  Account Details
                </MenuItem>
                <MenuItem>
                  My Orders
                </MenuItem>
                <hr className="my-3" />
                <MenuItem onClick={() => signOutUser()}>
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>

            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="lg:hidden inline-block p-1 font-medium"      >
              <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
                My Account
              </a>
            </Typography>
          </>
          :
          <>
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
              color="teal"
              onClick={() => navigate('/auth')}
            >
              Login
            </Button>
            <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="lg:hidden inline-block p-1 font-medium"      >
              <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
                Login
              </a>
            </Typography>
          </>
      }
    </ul>
  );
}

export default function Header() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="sticky top-0 z-10 mx-auto lg:max-w-screen-xl w-11/12 px-6 py-3">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5"        >
          Repair Hands
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}