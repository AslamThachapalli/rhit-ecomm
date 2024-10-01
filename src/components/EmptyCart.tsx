import { ContactShadows, OrbitControls, PerspectiveCamera, RenderTexture, Text } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"

const EmptyCart = () => {
    return (
       <>
       <div className="h-[70vh] w-full">
         <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            <Cube />
            <Dodecahedron position={[0, 1, 0]} scale={0.2} />
            <ContactShadows frames={1} position={[0, -0.5, 0]} blur={1} opacity={0.75} />
            <ContactShadows frames={1} position={[0, -0.5, 0]} blur={3} color="orange" />
            <OrbitControls 
            enableZoom={false}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.1} 
            />
        </Canvas>
       </div>

       <div className="w-full flex justify-center -mt-10">
        <p className="font-black text-xl sm:text-4xl md:text-7xl">
            Your Bag is empty
        </p>
        </div>
       </>
    )
}

function Cube() {
    const textRef = useRef<any>()
    useFrame((state) => (textRef.current.position.x = Math.sin(state.clock.elapsedTime) * 3))

    return (
        <mesh>
            <boxGeometry />
            <meshStandardMaterial>
                <RenderTexture attach="map" anisotropy={16}>
                    <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 5]} />
                    <color attach="background" args={['orange']} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} />
                    <Text ref={textRef} fontSize={4} color="#555">
                        Empty
                    </Text>
                    <Dodecahedron />
                </RenderTexture>
            </meshStandardMaterial>
        </mesh>
    )
}

function Dodecahedron(props: any) {
    const meshRef = useRef<any>()
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    useFrame(() => (meshRef.current.rotation.x += 0.01))
    return (
        <group {...props}>
            <mesh
                ref={meshRef}
                scale={clicked ? 1.5 : 1}
                onClick={() => click(!clicked)}
                onPointerOver={() => hover(true)}
                onPointerOut={() => hover(false)}>
                <dodecahedronGeometry args={[0.75]} />
                <meshStandardMaterial color={hovered ? 'hotpink' : '#5de4c7'} />
            </mesh>
        </group>
    )
}

export default EmptyCart