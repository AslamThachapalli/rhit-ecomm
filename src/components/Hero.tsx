import { Canvas } from "@react-three/fiber"
import { OrbitControls, Preload, useGLTF } from "@react-three/drei"
import rectangleHero from '/svg/rectangle-hero.svg';
import { motion } from 'framer-motion';

import CanvasLoader from "./CanvasLoader"
import { Suspense, useEffect, useState } from "react"
import { Button } from "@material-tailwind/react";
import { ArrowDownIcon } from "@heroicons/react/24/solid";

const Hero = () => {

    const title = "Empowering \n Your Tech \n Journey"
    const subtitle = "Discover top laptops and accessories to \n fuel your productivity and creativity."

    return (
        <section className="relative w-full h-[80vh] md:h-screen mx-auto bg-gradient-to-br from-[#1A1537] to-[#201F1F]">
            <img
                src={rectangleHero}
                alt="hero"
                className="absolute bottom-0 w-full object-contain"
            />

            <div className="absolute top-[150px] ps-8 sm:ps-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.25,
                        type: "spring"
                    }}
                    className="text-white font-bold text-5xl sm:text-7xl whitespace-pre-line"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5,
                        type: "spring"
                    }}
                    className="text-indigo-200 font-medium text-lg mt-5 whitespace-pre-line"
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.75,
                        type: "spring"
                    }}
                    className="mt-10 gap-4 flex items-center"
                >
                    <a href='#products'>
                        <Button className="rounded-full" color="indigo">Shop Now</Button>
                    </a>
                    <a href='#products'>
                        <div className="p-1 bg-indigo-500 rounded-full border-2 border-white animate-bounce">
                            <ArrowDownIcon className="h-6 w-6 text-white" />
                        </div>
                    </a>
                </motion.div>
            </div>

            <div className="hidden lg:block absolute -bottom-10 right-0 w-[70%] h-full  overflow-visible">
                <ComputerCanvas />
            </div>

        </section>
    )
}

const Computer = ({ screenWidth }: { screenWidth: number }) => {
    const computer = useGLTF('./sci-fi-laptop/scene.gltf');

    return (
        <mesh >
            <spotLight />
            <directionalLight position={[0, 30, 10]} castShadow />
            <primitive
                object={computer.scene}
                scale={screenWidth > 1350 ? 1.5 : 1}
                rotation={[-0.01, -0.5, 0.05]}
            />
        </mesh>
    )
}

const ComputerCanvas = () => {
    const [screenWidth, setScreenWidth] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
        }

        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <Canvas
            frameloop="demand"
            dpr={[1, 2]}
            camera={{ position: [-20, 7, 3], fov: 3 }}
            gl={{ preserveDrawingBuffer: true }}
            shadows
        >
            <Suspense fallback={<CanvasLoader />}>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2.7}
                />
                <Computer screenWidth={screenWidth} />
            </Suspense>

            <Preload all />
        </Canvas>
    )
}


export default Hero;