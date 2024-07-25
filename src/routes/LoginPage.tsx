import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/authStore";
import { firebaseCore } from "../lib/firebaseCore";
import { useState } from "react";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
    let navigate = useNavigate();
    let location = useLocation();
    let setUser = useSetRecoilState(userState);

    let [newUser, setNewUser] = useState(true);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState<{ show: boolean, message: string }>({
        show: false,
        message: '',
    });
    let [showPassword, setShowPassword] = useState(false);

    let from = location.state?.from?.pathname || "/";

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let email = formData.get("loginEmail") as string;
        let password = formData.get("loginPassword") as string;

        setLoading(true);

        try {
            const user = await firebaseCore.signInWithEmailPassword(email, password);
            setLoading(false)
            if (!user) {
                setError({
                    show: true,
                    message: 'User not registered'
                })
                return;
            }

            setUser(user);
            navigate(from, { replace: true });
        } catch (e: any) {
            setLoading(false)
            setError({
                show: true,
                message: e.message
            })
        }
    }

    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let firstname = formData.get("firstname") as string;
        let lastname = formData.get("lastname") as string;
        let email = formData.get("email") as string;
        let password = formData.get("password") as string;
        let confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError({
                show: true,
                message: "Passwords doesn't match"
            })
            return;
        }

        setLoading(true)

        try {
            const user = await firebaseCore.signUpWithEmailPassword(firstname, lastname, email, password);
            setLoading(false)
            setUser(user);
            navigate(from, { replace: true });
        } catch (e: any) {
            setLoading(false)
            setError({
                show: true,
                message: e.message
            })
        }
    }

    return (
        <div className="bg-auth-bg bg-cover bg-no-repeat h-screen flex justify-center items-center" >

            {error.show && <Toast
                message={error.message}
                onClose={() => {
                    setError({
                        show: false,
                        message: '',
                    })
                }} />}

            <div className="w-2/4 max-w-lg h-3/4 bg-white/30 backdrop-blur-sm rounded-3xl p-10">
                <div className="rounded-2xl h-14 w-full bg-black/30 flex flex-row text-white">

                    <div className={`basis-1/2 rounded-s-2xl flex justify-center items-center ${newUser ? 'bg-black' : ''}`} onClick={() => setNewUser(true)}>
                        Sign up
                    </div>

                    <div className={`basis-1/2 rounded-e-2xl flex justify-center items-center ${!newUser ? 'bg-black' : ''}`} onClick={() => setNewUser(false)}>
                        Log in
                    </div>

                </div>

                <div className="mt-10 mx-10">
                    {newUser ?
                        <form onSubmit={handleSignup} className="space-y-4">

                            <div className="flex flex-row gap-x-4">
                                <div>
                                    <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-black">
                                        First name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            type="text"
                                            className="h-12 border-gray-700 border block w-full rounded-xl text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-black">
                                        Last name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="lastname"
                                            name="lastname"
                                            type="text"
                                            className="h-12 border-gray-700 border block w-full rounded-xl text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-black">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="h-12 border-gray-700 border block w-full rounded-xl text-gray-90"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-black">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text': 'password'}
                                        required
                                        className="h-12 border-gray-700 border block w-full rounded-xl text-gray-900 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-black">
                                    Confirm Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="text"
                                        required
                                        className="h-12 border-gray-700 border block w-full rounded-xl text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center items-center rounded-full h-12 mt-5 bg-black text-sm font-semibold text-white"
                                >
                                    {
                                        loading ? <Spinner /> : 'Sign up'
                                    }
                                </button>
                            </div>
                        </form>
                        :
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="loginEmail" className="block text-sm font-medium leading-6 text-black">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="loginEmail"
                                        name="loginEmail"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="h-12 border-gray-700 border block w-full rounded-xl text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="loginPassword" className="block text-sm font-medium leading-6 text-black">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="loginPassword"
                                        name="loginPassword"
                                        type={showPassword ? 'text': 'password'}
                                        required
                                        className="h-12 border-gray-700 border block w-full rounded-xl text-gray-900 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center items-center rounded-full h-12 mt-1 bg-black text-sm font-semibold text-white"
                                >
                                    {
                                        loading ? <Spinner /> : 'Log in'
                                    }
                                </button>
                            </div>
                        </form>
                    }
                </div>
            </div>

        </div>
    );
}