import { Button, Card, Input, Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { signInWithEmailPassword, signUpWithEmailPassword } from "../data/authData";
import toast from "react-hot-toast";

export default function AuthRoute() {
    const [newUser, setNewUser] = useState(false)
    let [error, setError] = useState<{ show: boolean, message: string }>({
        show: false,
        message: '',
    });

    return (
        <>
            {error.show && <Toast
                message={error.message}
                onClose={() => {
                    setError({
                        show: false,
                        message: '',
                    })
                }} />}

            <div className="bg-surface bg-cover bg-no-repeat h-screen flex justify-center items-center overflow-scroll" >
                <Card className="p-8 bg-white backdrop-blur-sm">
                    {newUser ?
                        <SignupForm onSigninPressed={() => setNewUser(false)} /> :
                        <SigninForm onSignupPressed={() => setNewUser(true)} />}
                </Card>
            </div>
        </>

    )
}

interface SigninFormProps {
    onSignupPressed: () => void
}

function SigninForm({ onSignupPressed }: SigninFormProps) {
    let navigate = useNavigate();
    let location = useLocation();
    let setUser = useSetRecoilState(userAtom);

    let [loading, setLoading] = useState(false);

    let [showPassword, setShowPassword] = useState(false);

    let from = location.state?.from?.pathname || "/";

    async function handleSignin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let email = formData.get("email") as string;
        let password = formData.get("password") as string;

        setLoading(true);

        try {
            const user = await signInWithEmailPassword(email, password);
            setLoading(false)
            if (!user) {
                toast.error("User not registered")
                return;
            }

            setUser(user);
            navigate(from, { replace: true });
        } catch (e: any) {
            setLoading(false)
            toast.error(e.message)
        }
    }

    return (
        <>

            <Typography variant="h4" color="blue-gray">
                Sign In
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Welcome back! Enter your details to signin.
            </Typography>

            <form onSubmit={handleSignin} className="mt-8 mb-2 w-full max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">

                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Email
                    </Typography>
                    <Input
                        id="email"
                        size="lg"
                        name="email"
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />

                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Password
                    </Typography>
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        size="lg"
                        placeholder="********"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-10"
                        icon={<IconButton
                            variant="text"
                            ripple={false}
                            className="-mt-2 hover:bg-transparent focus:bg-transparent active:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </IconButton>}
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />

                </div>

                <Button loading={loading} type="submit" className="mt-6 flex justify-center" fullWidth >
                    sign in
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal">
                    Don't have an account?{" "}
                    <button type="button" onClick={onSignupPressed} className="font-medium text-gray-900">
                        Sign Up
                    </button>
                </Typography>
            </form>
        </>
    )
}

interface SignupFormProps {
    onSigninPressed: () => void
}

function SignupForm({ onSigninPressed }: SignupFormProps) {
    let navigate = useNavigate();
    let location = useLocation();
    let setUser = useSetRecoilState(userAtom);

    let [loading, setLoading] = useState(false);
    let [showPassword, setShowPassword] = useState(false);

    let from = location.state?.from?.pathname || "/";

    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let firstname = formData.get("firstname") as string;
        let lastname = formData.get("lastname") as string;
        let email = formData.get("email") as string;
        let password = formData.get("password") as string;

        setLoading(true)

        try {
            const user = await signUpWithEmailPassword(firstname, lastname, email, password);
            setLoading(false)
            setUser(user);
            navigate(from, { replace: true });
        } catch (e: any) {
            setLoading(false)
            toast.error(e.message)
        }
    }

    return (
        <>
            <Typography variant="h4" color="blue-gray">
                Sign Up
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter your details to register.
            </Typography>

            <form onSubmit={handleSignup} className="mt-8 mb-2 w-full max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <div className="flex flex-row -mt-3">
                        <div className="flex-1">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                First Name
                            </Typography>
                            <Input
                                id="firstname"
                                name="firstname"
                                size="lg"
                                placeholder="John"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 max-w-[180px]"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }} />
                        </div>

                        <div className="flex-1">
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Last Name
                            </Typography>
                            <Input
                                id="lastname"
                                name="lastname"
                                size="lg"
                                placeholder="Snow"
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 max-w-[180px]"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }} />
                        </div>
                    </div>
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Email
                    </Typography>
                    <Input
                        id="email"
                        name="email"
                        size="lg"
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />

                    <Typography variant="h6" color="blue-gray" className="-mb-3" >
                        Password
                    </Typography>
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        size="lg"
                        placeholder="********"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-10"
                        icon={<IconButton
                            variant="text"
                            ripple={false}
                            className="-mt-2 hover:bg-transparent focus:bg-transparent active:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </IconButton>}
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />

                </div>

                <Button loading={loading} type="submit" className="mt-6 flex justify-center" fullWidth >
                    sign up
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal">
                    Already have an account?{" "}
                    <button type="button" onClick={onSigninPressed} className="font-medium text-gray-900">
                        Sign In
                    </button>
                </Typography>
            </form>
        </>
    )
}