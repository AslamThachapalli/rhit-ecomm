import {
    Card,
    Input,
    Button,
} from "@material-tailwind/react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import React, { useRef } from "react";

export default function MyProfileRoute() {
    const ref = useRef<HTMLFormElement>(null);
    const user = useRecoilValue(userAtom)!;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const firstname = formData.get('firstname')
        const lastname = formData.get('lastname')
        const email = formData.get('email')
        const phone = formData.get('phone')
    }

    return (
        <Card className="p-8 lg:p-14">
            <form ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-7 group">
                <h2 className="text-lg font-semibold">
                    Edit Your Profile
                </h2>
                <div className="flex gap-7 lg:gap-10 flex-col lg:flex-row">
                    <Input
                        size="lg"
                        label="First Name"
                        name="firstname"
                        defaultValue={user.firstname}
                    />
                    <Input
                        size="lg"
                        label="Last Name"
                        name="lastname"
                        defaultValue={user.lastname}
                    />
                </div>

                <Input
                    size="lg"
                    label="Email"
                    name="email"
                    required
                    type="email"
                    defaultValue={user.email}
                />

                <Input
                    size="lg"
                    label="Phone"
                    name="phone"
                    pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
                    minLength={10} 
                    maxLength={13}
                    defaultValue={user.phone}
                />

                <h2 className="text-lg font-semibold">
                    Password Changes
                </h2>

                <Input size="lg" label="Current Password" />

                <Input size="lg" label="New Password" />

                <Input size="lg" label="Confirm New Password" />

                <div className="flex justify-end gap-2">
                    <Button
                        variant="text"
                        onClick={() => ref.current?.reset()}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        className="group-invalid:pointer-events-none group-invalid:opacity-30"
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Card>
    )
}