import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { addressAtom } from "../store/atoms/addressAtoms";
import { Button, Checkbox, Input } from "@material-tailwind/react";
import { createAddress, getAllAddress, updateAddress } from "../data/addressData";
import toast from "react-hot-toast";

interface AddressFormProps {
    onCancel: () => void;
    onSaved: () => void;
    onSaveError?: (message: string) => void;
    address?: Address
}

export default function AddNewAddressForm({ onCancel, onSaved, onSaveError, address }: AddressFormProps) {
    const user = useRecoilValue(userAtom)!;
    const setAddresses = useSetRecoilState(addressAtom)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name')
        const phone = formData.get('phone')
        const email = formData.get('email')
        const alternateNumber = formData.get('alt-phone')
        const addressStr = formData.get('address')
        const landmark = formData.get('landmark')
        const pincode = formData.get('pincode')
        const city = formData.get('city')
        const state = formData.get('state')
        const isDefault = formData.get('isDefault')

        const newAddress: Partial<Address> = {
            userId: user?.id,
            name: name?.toString(),
            phone: phone?.toString(),
            email: email?.toString(),
            alternateNumber: alternateNumber?.toString(),
            address: addressStr?.toString(),
            landmark: landmark?.toString(),
            pincode: pincode?.toString(),
            city: city?.toString(),
            country: "India",
            state: state?.toString(),
            isDefault: isDefault === 'on',
        }

        try {
            const alladdresses = await getAllAddress(user.id);
            const defaultAddress = alladdresses.find((a) => a.isDefault)

            if (defaultAddress && isDefault === 'on') {
                defaultAddress.isDefault = false
                await updateAddress(defaultAddress)
            }

            if (address) {
                newAddress.id = address.id

                await updateAddress(newAddress);
            } else {
                await createAddress(newAddress)
            }

            const newAlladdresses = await getAllAddress(user.id);
            setAddresses(newAlladdresses)
            onSaved()
        } catch (e: any) {
            toast.error(e.message)
            
            if(onSaveError){
                onSaveError(e.message);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 group" noValidate>
            <div className="grid lg:grid-cols-2 gap-6">
                <Input name="name" defaultValue={address?.name} minLength={3} required label="Full Name" size="lg" />
                <Input name="phone" defaultValue={address?.phone} minLength={10} maxLength={13} required type="text" pattern="^(\+91[\-\s]?)?[6-9]\d{9}$" label="Mobile number" size="lg" />
                <Input name="email" defaultValue={address?.email} className="peer" required type="email" pattern="^[\w\.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$" label="Email" size="lg" />
                <Input name="alt-phone" defaultValue={address?.alternateNumber} minLength={10} maxLength={13} type="text" pattern="^(\+91[\-\s]?)?[6-9]\d{9}$" label="Alternate contact number" size="lg" />
            </div>
            <Input name="address" defaultValue={address?.address} minLength={5} required label="Complete address" size="lg" />
            <Input name="landmark" defaultValue={address?.landmark} minLength={5} label="Landmark" size="lg" />
            <div className="grid lg:grid-cols-2 gap-6">
                <Input name="pincode" defaultValue={address?.pincode} required type="text" pattern="^\d{6}$" label="Pincode" size="lg" />
                <Input name="city" defaultValue={address?.city} minLength={3} required label="City" size="lg" />
                <Input name="state" defaultValue={address?.state} minLength={3} required label="State" size="lg" />
                <Input name="country" disabled value="India" label="Country" size="lg" />
            </div>
            <Checkbox name="isDefault" color="indigo" defaultChecked={address?.isDefault} label="Set as default" />
            <div className="flex justify-end gap-2">
                <Button variant="text"  onClick={() => onCancel()}>
                    Cancel
                </Button>

                <Button type="submit" className="group-invalid:pointer-events-none group-invalid:opacity-30">
                    Save Address
                </Button>
            </div>
        </form>
    )
}