import { useEffect, useState } from "react";
import { getAllProducts } from "../data/productsData";
import SectionWrapper from "./SectionWrapper";
import { motion } from 'framer-motion';
import { textVariant } from "../lib/motion";
import { formatToPrice } from "../lib/formatters";
import Tilt from "react-parallax-tilt";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
    const navigate = useNavigate();

    return (
        <Tilt>
            <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="rounded-xl min-h-[280px] p-[1px] bg-gradient-to-b from-indigo-800 to-orange-700 transition-all ease-in hover:scale-105 cursor-pointer shadow-xl"
            >
                <div className="bg-white py-4 px-6 rounded-xl flex flex-col justify-start items-start">
                    <img
                        src={product.mainImg}
                        alt={product.name}
                        className="bg-white h-60 w-full object-contain"
                    />
                    <p className="mt-6 font-extrabold text-[20px]">{product.name}</p>
                    <p className="mt-2 font-bold">{formatToPrice(product.price)}</p>
                </div>
            </div>
        </Tilt>
    )
}

const ProductSection = () => {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        getAllProducts().then((val) => setProducts(val))
    }, [])

    return (
        <>
            <motion.div
                variants={textVariant()}
                initial='hidden'
                whileInView='show'
                viewport={{
                    once: true,
                    amount: 0.25
                }}
            >
                <p className="sm:text-[18px] text-[14px] text-indigo-300 uppercase tracking-wider">Empower Your Work, Play, and Creativity</p>
                <h1 className="text-indigo-500 font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">Laptops.</h1>
            </motion.div>

            <div className="w-full mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((product, index) => (
                    <ProductCard
                        key={`laptop-${index}`}
                        product={product}
                    />
                ))}
            </div>
        </>
    )
}

export default SectionWrapper(ProductSection)