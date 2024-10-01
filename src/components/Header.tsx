import { useEffect, useState } from "react";
import {
  IconButton,
  Button,
  Spinner,
  Badge,
} from "@material-tailwind/react";
import { UserIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRecoilStateLoadable, useRecoilValueLoadable } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cartCountAtom } from "../store/atoms/cartAtoms";
import { signOutUser } from "../data/authData";

const Header = () => {
  const [user, setUser] = useRecoilStateLoadable(userAtom);
  const cartCount = useRecoilValueLoadable(cartCountAtom);
  const [scrolled, setScrolled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolltop = window.scrollY;

      setScrolled(scrolltop > 100)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const signOut = () => {
    signOutUser()

    setUser(null);
  }

  return (
    <div className="flex justify-center">
      <div className={`transition-all ease-in-out duration-700 fixed top-0 z-20 flex items-center justify-center py-4 ${scrolled ?
        "bg-blue-gray-800/50 backdrop-blur-md w-full lg:w-11/12 xl:w-9/12 lg:mt-5 mt-0 px-8 rounded-none lg:rounded-xl shadow" :
        `${location.pathname === "/" ? "bg-transparent" : "bg-blue-gray-300"} w-full px-8 lg:px-36 shadow-none`}`}>
        <div className={`relative w-full flex justify-between items-center mx-auto text-white`}>
          <Link
            to="/"
            className="flex "
          >
            <p className="font-black text-xl">Repair Hands</p>
          </Link>
          <div className="flex flex-1 justify-end items-center gap-7">
            <Badge
              content={`${cartCount.contents}`}
              withBorder
              invisible={cartCount.state == 'loading' || cartCount.contents == null}
              color="indigo"
            >
              <IconButton
                variant="text"
                className="h-8 w-8 text-inherit"
                ripple={true}
                onClick={() => navigate('/cart')}
              >
                <ShoppingCartIcon className="h-6 w-6" />
              </IconButton>
            </Badge>
            {
              user.state === "loading" ?
                <Spinner /> :
                user.contents ?
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setToggle(!toggle)
                    }}
                  >
                    <UserIcon className="h-6 w-6" />

                    <div className={`${toggle ? "flex" : "hidden"
                      } absolute top-11 right-0 py-3 px-4 bg-white rounded-xl shadow`}>
                      <ul className="list-none flex flex-1 flex-col justify-end items-start gap-4 text-black">
                        <li
                          className="text-black hover:text-gray-600 text-[18px] font-medium cursor-pointer"
                          onClick={() => {
                            navigate('/account/my-profile')
                            setToggle(!toggle)
                          }}
                        >Account Details</li>
                        <li
                          className="text-black hover:text-gray-600 text-[18px] font-medium cursor-pointer"
                          onClick={() => {
                            navigate('/account/my-orders')
                            setToggle(!toggle)
                          }}
                        >My Orders</li>
                        <li
                          className="text-black hover:text-gray-600 text-[18px] font-medium cursor-pointer"
                          onClick={() => {
                            signOut();
                            setToggle(!toggle);
                          }}
                        >Sign Out</li>
                      </ul>
                    </div>
                  </div> :
                  <Button
                    variant="gradient"
                    size="sm"
                    className="hidden lg:inline-block"
                    color="indigo"
                    onClick={() => navigate('/auth')}
                  >
                    Sign in
                  </Button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header