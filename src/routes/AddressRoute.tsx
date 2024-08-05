import { Button, Card, Checkbox, Dialog, DialogBody, DialogFooter, Input, Typography } from "@material-tailwind/react";
import {
    PlusIcon
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/authStore";
import { createAddress, deleteAddress, getAllAddress, updateAddress } from "../data/addressData";
import Toast from "../components/Toast";

export default function AddressRoute() {
    const [newAddress, setNewAddress] = useState<{ add: boolean, currentAddress?: Address }>({
        add: false
    })
    const [showError, setShowError] = useState<{ show: boolean, message: string }>({
        show: false,
        message: ''
    })

    return (
        <>
            {showError.show && <Toast
                message={showError.message}
                onClose={() => setShowError({
                    show: false,
                    message: ''
                })}
            />}

            <Card className="p-14 min-h-[75vh]">
                {
                    newAddress.add ?
                        <AddNewAddressForm
                            onCancel={() => setNewAddress({
                                add: false,
                            })}
                            onSaved={() => setNewAddress({
                                add: false
                            })}
                            onSaveError={(message) => setShowError({
                                show: true,
                                message,
                            })}
                            address={newAddress.currentAddress}
                        />
                        : <AllAddresses
                            onAddNewAddressPressed={() => setNewAddress({
                                add: true
                            })}
                            onError={(message) => setShowError({
                                show: true,
                                message,
                            })}
                            onEditAddressPressed={(address) => setNewAddress({
                                add: true,
                                currentAddress: address,
                            })}
                        />
                }
            </Card>
        </>
    )
}

interface AddressFormProps {
    onCancel: () => void;
    onSaved: () => void;
    onSaveError: (message: string) => void;
    address?: Address
}

function AddNewAddressForm({ onCancel, onSaved, onSaveError, address }: AddressFormProps) {
    const user = useRecoilValue(userState)!;

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
            userId: user?.uid,
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
            const alladdresses = await getAllAddress(user.uid);
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
            onSaved()
        } catch (e: any) {
            console.log(e)
            onSaveError(e.message);
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

interface AllAddressesProps {
    onAddNewAddressPressed: () => void;
    onError: (message: string) => void;
    onEditAddressPressed: (address: Address) => void;
}

function AllAddresses({ onAddNewAddressPressed, onError, onEditAddressPressed }: AllAddressesProps) {
    const user = useRecoilValue(userState)!;

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [deleteState, setDeleteState] = useState<{ showDialog: boolean, deleteId?: string }>({
        showDialog: false
    });

    useEffect(() => {
        getAllAddress(user.uid).then((result) => {
            setAddresses(result)
        }).catch((e) => {
            onError(e.message)
        })
    }, [])

    async function handleSetAsDefault(newDefault: Address) {
        try {
            const prevDefault = addresses.find((x) => x.isDefault)!;
            if (prevDefault) {
                prevDefault.isDefault = false;
            }
            newDefault.isDefault = true

            await Promise.all([
                updateAddress(prevDefault),
                updateAddress(newDefault),
            ])

            const allAddresses = await getAllAddress(user?.uid)
            setAddresses(allAddresses)
        } catch (e: any) {
            onError(e.message)
        }
    }

    async function handleDelete() {
        try {
            await deleteAddress(deleteState.deleteId!);
            const allAddresses = await getAllAddress(user?.uid)
            setAddresses(allAddresses)
        } catch (e: any) {
            onError(e.message)
        }

        setDeleteState({ showDialog: false })
    }

    const showDeleteConfirmation = (id: string) => {
        setDeleteState({
            showDialog: true,
            deleteId: id,
        })
    }

    const cancelDelete = () => {
        setDeleteState({ showDialog: false })
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <Dialog size="xs" open={deleteState.showDialog} handler={cancelDelete}>
                <DialogBody>Confirm to delete the current address?</DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="teal"
                        onClick={cancelDelete}
                        className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="teal"
                        onClick={handleDelete}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            {
                addresses.map(address =>
                    <div key={address.id} className="group border border-gray-300 h-40 rounded p-4 hover:border-gray-900 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between">
                                <Typography variant="h6">{address.name}</Typography>
                                <div className="text-yellow-800">{address.isDefault && 'Default'}</div>
                            </div>
                            <Typography variant="h6">
                                {address.phone}
                            </Typography>
                            <Typography variant="small" className="pt-2">
                                {`${address.address} ${address.city} ${address.pincode}`}
                            </Typography>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Typography variant="small" onClick={() => handleSetAsDefault(address)} className="invisible group-hover:visible hover:cursor-pointer hover:text-yellow-800 text-gray-900">
                                {address.isDefault || 'Set as Default'}
                            </Typography>
                            <Typography variant="small" onClick={() => showDeleteConfirmation(address.id)} className="invisible group-hover:visible hover:cursor-pointer hover:text-yellow-800 text-gray-900">
                                Delete
                            </Typography>
                            <Typography variant="small" onClick={() => onEditAddressPressed(address)} className="invisible group-hover:visible hover:cursor-pointer hover:text-yellow-800 text-gray-900">
                                Edit
                            </Typography>
                        </div>
                    </div>)
            }

            <div onClick={() => onAddNewAddressPressed()} className="border border-gray-300 h-40 rounded flex flex-col justify-center items-center hover:border-gray-900 text-gray-400 hover:text-gray-900 hover:cursor-pointer">
                <PlusIcon className="h-8 w-8" />
                <Typography variant="paragraph" color="gray">
                    Add a new address
                </Typography>
            </div>
        </div>
    )
}