import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
    Typography,
    Card,
    Spinner,
} from "@material-tailwind/react";
import { Suspense } from "react";

export default function RootRoute() {
    return (
        <div className="max-h-screen overflow-scroll bg-surface pt-8">

            <Header />

            <Suspense fallback={<Loading />}>
                <div className="">
                    <Outlet />
                </div>
            </Suspense>
            
            <div className="h-96"></div>

            <Footer />
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