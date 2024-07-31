import {
    Card,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";

export default function MyProfileRoute() {
    return (
        <Card className="p-14">
            <div className="flex flex-col gap-7">
                <Typography variant="h5" color="red" className="">
                    Edit Your Profile
                </Typography>
                <div className="flex gap-10">
                    <Input size="lg" label="First Name"/>
                    <Input size="lg" label="Last Name"/>
                </div>


                <Input size="lg" label="Email"/>

                <Input size="lg" label="Phone"/>

                <Typography variant="lead">
                    Password Changes
                </Typography>

                <Input size="lg" label="Current Password"/>

                <Input size="lg" label="New Password"/>

                <Input size="lg" label="Confirm New Password"/>

                <div className="flex justify-end gap-2">
                    <Button variant="text" color="gray">
                        Cancel
                    </Button>

                    <Button color="red">
                        Save Changes
                    </Button>
                </div>
            </div>
        </Card>
    )
}