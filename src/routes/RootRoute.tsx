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
        <div className="max-h-screen overflow-scroll bg-surface pt-8">

            <Toaster position="top-right" />

            <Header />

            <Suspense fallback={<Loading />}>
                <div className="">
                    <Outlet />
                </div>
            </Suspense>
            
            <div className="mt-6">

            <Footer />
            </div>
        </div>
    )
}

function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Spinner color="teal" />
        </div>
    )
}