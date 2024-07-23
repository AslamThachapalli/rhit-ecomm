import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="bg-red-500 flex flex-row">
            <Link to={'/login'}>Login</Link>
            <Link to={'/cart'}>Cart</Link>
        </div>
    )
}