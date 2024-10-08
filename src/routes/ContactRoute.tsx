import { Button } from "@material-tailwind/react"
import React, { useRef, useState } from "react"
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const ContactRoute = () => {
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const name = formData.get("name")
        const email = formData.get("email")
        const message = formData.get("message")

        setLoading(true);

        emailjs.send(
            import.meta.env.VITE_EMAIL_SERVICE_ID,
            import.meta.env.VITE_EMAIL_TEMPLATE_ID,
            {
              from_name: name,
              to_name: "Repair Hands",
              from_email: email,
              to_email: "aslam.develop912@gmail.com",
              message: message,
            },
            import.meta.env.VITE_EMAIL_PUBLIC_KEY
          )
            .then(
              () => {
                setLoading(false)
      
                toast.success("Thank you. We will get back to you as soon as possible.")
                ref.current?.reset()
              },
              (error) => {
                setLoading(false)
      
                console.log(error)
                toast.error("Ahh, something went wrong. Please try again.")
              }
            )
    }

    return (
        <div
            className="mx-auto pt-24 px-6 min-h-[90vh] lg:max-w-screen-xl flex flex-col items-center justify-center gap-4"
        >
            <h1 className="text-4xl font-bold">Get in touch</h1>
            <h3 className="text-lg font-semibold text-blue-gray-600 text-center">We'd love to hear from you. Please fill out this form.</h3>

            <form
                ref={ref}
                onSubmit={handleSubmit}
                className="mt-2 flex flex-col gap-4 min-w-80 md:min-w-96"
            >
                <label
                    className="flex flex-col"
                >
                    <span className="mb-2 font-medium text-blue-gray-600">Your Name</span>
                    <input
                        type="text"
                        name="name"
                        placeholder="What's your good name?"
                        className="py-4 px-6 text-blue-gray-900 rounded-lg outline-none border-none font-medium"
                    />
                </label>

                <label
                    className="flex flex-col"
                >
                    <span className="mb-2 font-medium text-blue-gray-600">Your Email</span>
                    <input
                        name="email"
                        type="text"
                        placeholder="What's your web address?"
                        className="py-4 px-6 text-blue-gray-900 rounded-lg outline-none border-none font-medium"
                    />
                </label>

                <label
                    className="flex flex-col"
                >
                    <span className="mb-2 font-medium text-blue-gray-600">Your Message</span>
                    <textarea
                        rows={7}
                        name="message"
                        placeholder="What's do you want to say?"
                        className="py-4 px-6 text-blue-gray-900 rounded-lg outline-none border-none font-medium"
                    />
                </label>

                <Button
                    type="submit"
                    loading={loading}
                >
                    Send
                </Button>
            </form>
        </div>
    )
}

export default ContactRoute