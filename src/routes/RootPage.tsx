import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootPage() {
    return (
        <>
            <Header />

            <div className="bg-blue-400">
                <Outlet />
            </div>

            <Footer />
        </>
    )
}