import { useParams } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { getProductAtom } from "../store/atoms/productAtoms"
import { useEffect, useRef, useState } from "react"
import { formatToPrice } from "../lib/formatters"
import { Button } from "@material-tailwind/react"

const ImageGallery = ({ images, id }: { images: string[], id: string }) => {
    const [active, setActive] = useState(0)

    return (
        <div className="flex flex-col gap-5">
            <div className="">
                <img
                    src={images[active]}
                    className="w-full max-w-full object-contain object-center md:h-[500px]"
                />
            </div>

            <div className="flex flex-row gap-5 justify-center">
                {
                    images.map((image, index) => (
                        <img
                            key={`${id}-${index}`}
                            onClick={() => setActive(index)}
                            src={image}
                            className={`${active === index ? "border-2 border-black" : ""} transition-all w-24 h-24 object-fill object-center rounded-lg`}
                        />
                    ))
                }
            </div>
        </div>
    )
}

const ProductDetailRoute = () => {
    const { id } = useParams()
    const product = useRecoilValue(getProductAtom(id))

    if (!product) {
        return (
            <div className="py-40 px-20">
                Product not Found
            </div>
        )
    }

    return (
        <div className="relative pt-28 w-11/12 mx-auto">
            <div className="relative lg:fixed inset-0 w-full lg:w-6/12 pt-0 lg:pt-28 mb-10">
                <div className="mr-0 lg:mr-4">
                    <ImageGallery
                        images={[product.mainImg, ...product.moreImgs]}
                        id={product.id}
                    />
                </div>
            </div>

            <div className="w-full ml-auto lg:w-6/12">
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-2xl">{product.heading}</p>
                    <p className="pt-4 font-semibold text-xl">{formatToPrice(product.price)}</p>
                    <Button
                        className="flex items-center justify-center gap-3 my-6"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Add to Cart
                    </Button>

                    <div className="bg-gray-200 rounded-md py-2 px-3 flex items-center gap-4 text-[14px] font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                        14-Day Returns on Any Purchase
                    </div>

                    <ul className="my-8">
                        {
                            Object.entries(product.quickInfo).map(([key, value]) => (
                                <li
                                    key={`${product.id}-quickInfo-${key}`}
                                    className="py-1"
                                >
                                    <div className="w-full grid grid-cols-4 gap-4 leading-tight">
                                        <h4 className="font-semibold text-sm">{key}</h4>
                                        <p className="text-sm">{value}</p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    <h4 className="font-semibold text-lg">About this item</h4>
                    <ul className="list-disc text-[14px] ps-2">
                        {
                            product.about.map((ab, index) => (
                                <li
                                    key={`${product.id}-about-${index}`}
                                >
                                    {ab}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailRoute