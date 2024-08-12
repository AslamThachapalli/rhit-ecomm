import { Button, Card, Dialog, DialogBody, DialogFooter, Typography } from "@material-tailwind/react";
import {
    PlusIcon
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { deleteAddress, getAllAddress, updateAddress } from "../data/addressData";
import Toast from "../components/Toast";
import { addressAtom } from "../store/atoms/addressAtoms";
import AddNewAddressForm from "../components/AddNewAddressForm";

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

interface AllAddressesProps {
    onAddNewAddressPressed: () => void;
    onError: (message: string) => void;
    onEditAddressPressed: (address: Address) => void;
}

function AllAddresses({ onAddNewAddressPressed, onError, onEditAddressPressed }: AllAddressesProps) {
    const user = useRecoilValue(userAtom)!
    const [addresses, setAddresses] = useRecoilState(addressAtom)!;

    const [deleteState, setDeleteState] = useState<{ showDialog: boolean, deleteId?: string }>({
        showDialog: false
    });

    async function handleSetAsDefault(newDefault: Address) {
        try {
            let prevDefault = addresses.find((x) => x.isDefault)!;
            if (prevDefault) {
                prevDefault = {
                    ...prevDefault,
                    isDefault : false
                };
            }

            newDefault = {
                ...newDefault,
                isDefault: true
            }

            await Promise.all([
                updateAddress(prevDefault),
                updateAddress(newDefault),
            ])

            const allAddresses = await getAllAddress(user.id)
            setAddresses(allAddresses)
        } catch (e: any) {
            onError(e.message)
        }
    }

    async function handleDelete() {
        try {
            await deleteAddress(deleteState.deleteId!);
            // const allAddresses = await getAllAddress(user?.id)
            setAddresses((addresses) => addresses.filter((address) => address.id != deleteState.deleteId))
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