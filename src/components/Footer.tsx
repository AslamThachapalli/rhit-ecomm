import { useNavigate } from "react-router-dom"

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="w-ful p-8 flex justify-center items-center">
            <p
                className="cursor-pointer hover:text-blue-gray-300"
                onClick={() => navigate('/contact-us')}
            >
                Contact us
            </p>
        </footer>
    )
}