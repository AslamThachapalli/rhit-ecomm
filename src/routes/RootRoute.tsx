import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
    Spinner,
} from "@material-tailwind/react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

export default function RootRoute() {
    return (
        <div className="bg-surface flex-col flex">

            <Toaster position="top-right" />

            <Header />

            <div className="flex-1">
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
            </div>

            {/* <div className="mt-6">
                <Footer />
            </div> */}
        </div>
    )
}

function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Spinner color="indigo" />
        </div>
    )
}