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
        const pincode = formData.get('pincode')
        const city = formData.get('city')
        const state = formData.get('state')
        const addressStr = formData.get('address')
        const landmark = formData.get('landmark')
        const isDefault = formData.get('isDefault')

        const newAddress: Partial<Address> = {
            userId: user?.id,
            name: name?.toString(),
            phone: phone?.toString(),
            email: email?.toString(),
            pincode: pincode?.toString(),
            city: city?.toString(),
            state: state?.toString(),
            address: addressStr?.toString(),
            landmark: landmark?.toString(),
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <Input name="name" color="teal" defaultValue={address?.name} required label="Full Name" size="lg" />
                <Input name="phone" defaultValue={address?.phone} required type="number" label="Mobile number" size="lg" />
                <Input name="email" defaultValue={address?.email} required type="email" label="Email" size="lg" />
                <Input name="pincode" defaultValue={address?.pincode} required type="number" label="Pincode" size="lg" />
                <Input name="city" defaultValue={address?.city} required label="Town / City" size="lg" />
                <Input name="state" defaultValue={address?.state} required label="State" size="lg" />
            </div>
            <Input name="address" defaultValue={address?.address} required label="Address" size="lg" />
            <Input name="landmark" defaultValue={address?.landmark} label="Landmark" size="lg" />
            <Checkbox name="isDefault" color="teal" defaultChecked={address?.isDefault} label="Set as default" />
            <div className="flex justify-end gap-2">
                <Button variant="text" color="teal" onClick={() => onCancel()}>
                    Cancel
                </Button>

                <Button type="submit" color="teal">
                    Save Address
                </Button>
            </div>
        </form>
    )
}