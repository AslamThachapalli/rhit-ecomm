import { Button, Card, Input, Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseCore } from "../lib/firebaseCore";
import Toast from "../components/Toast";

export default function LoginPage() {
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

            <div className="bg-blue-gray-100 bg-cover bg-no-repeat h-screen flex justify-center items-center overflow-scroll" >
                <Card className="p-8 bg-white/30 backdrop-blur-sm" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    {newUser ?
                        <SignupForm
                            onSigninPressed={() => setNewUser(false)}
                            onError={(message) => setError({
                                show: true,
                                message: message
                            })} /> :
                        <SigninForm
                            onSignupPressed={() => setNewUser(true)}
                            onError={(message) => setError({
                                show: true,
                                message: message
                            })} />}
                </Card>
            </div>
        </>

    )
}

interface SigninFormProps {
    onSignupPressed: () => void
    onError: (message: string) => void
}

function SigninForm({ onSignupPressed, onError }: SigninFormProps) {
    let navigate = useNavigate();
    let location = useLocation();
    let setUser = useSetRecoilState(userState);

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
            const user = await firebaseCore.signInWithEmailPassword(email, password);
            setLoading(false)
            if (!user) {
                onError('User not registered')
                return;
            }

            setUser(user);
            navigate(from, { replace: true });
        } catch (e: any) {
            setLoading(false)
            onError(e.message)
        }
    }

    return (
        <>

            <Typography variant="h4" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Sign In
            </Typography>
            <Typography color="gray" className="mt-1 font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Welcome back! Enter your details to signin.
            </Typography>

            <form onSubmit={handleSignin} className="mt-8 mb-2 w-full max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">

                    <Typography variant="h6" color="blue-gray" className="-mb-3" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                    />

                    <Typography variant="h6" color="blue-gray" className="-mb-3" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined} >
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
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </IconButton>}
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                    />

                </div>

                <Button loading={loading} type="submit" className="mt-6 flex justify-center" fullWidth onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined} >
                    sign in
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>
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
    onError: (message: string) => void
}

function SignupForm({ onSigninPressed, onError }: SignupFormProps) {
    let navigate = useNavigate();
    let location = useLocation();
    let setUser = useSetRecoilState(userState);

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
            const user = await firebaseCore.signUpWithEmailPassword(firstname, lastname, email, password);
            setLoading(false)
            setUser(user);
            navigate(from, { replace: true });
        } catch (e: any) {
            setLoading(false)
            onError(e.message)
        }
    }

    return (
        <>

            <Typography variant="h4" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Sign Up
            </Typography>
            <Typography color="gray" className="mt-1 font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Nice to meet you! Enter your details to register.
            </Typography>

            <form onSubmit={handleSignup} className="mt-8 mb-2 w-full max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <div className="flex flex-row -mt-3">
                        <div className="flex-1">
                            <Typography variant="h6" color="blue-gray" className="mb-3" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </div>

                        <div className="flex-1">
                            <Typography variant="h6" color="blue-gray" className="mb-3" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined} />
                        </div>
                    </div>
                    <Typography variant="h6" color="blue-gray" className="-mb-3" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                    />

                    <Typography variant="h6" color="blue-gray" className="-mb-3" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined} >
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
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </IconButton>}
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}
                    />

                </div>

                <Button loading={loading} type="submit" className="mt-6 flex justify-center" fullWidth onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined} >
                    sign up
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>
                    Already have an account?{" "}
                    <button type="button" onClick={onSigninPressed} className="font-medium text-gray-900">
                        Sign In
                    </button>
                </Typography>
            </form>
        </>
    )
}