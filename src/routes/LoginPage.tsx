import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atoms/authStore";
import { firebaseCore } from "../lib/firebaseCore";

export default function LoginPage() {
    let navigate = useNavigate();
    let location = useLocation();
    let setUser = useSetRecoilState(userState);

    let from = location.state?.from?.pathname || "/";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let formData = new FormData(event.currentTarget);
        let username = formData.get("username") as string;
        let password = formData.get("password") as string;

        console.log(username, password)

        try {
            const user = await firebaseCore.signInWithEmailPassword(username, password);
            setUser(user);
            navigate(from, { replace: true });
        } catch (e) {
            console.log('error signing in', e)
        }
    }

    return (
        <div>
            <p>You must log in to view the page at {from}</p>

            <form onSubmit={handleSubmit}>
                <label>
                    Username: <input name="username" type="text" />
                </label>{" "}
                <label>
                    Password: <input name="password" type="password" />
                </label>{" "}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}