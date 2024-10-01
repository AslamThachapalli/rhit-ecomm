import { Button, Card, Dialog, DialogBody, DialogFooter, Typography } from "@material-tailwind/react";
import {
    PlusIcon
} from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/authAtoms";
import { deleteAddress, getAllAddress, updateAddress } from "../data/addressData";
import { addressAtom } from "../store/atoms/addressAtoms";
import AddNewAddressForm from "../components/AddNewAddressForm";
import toast from "react-hot-toast";

export default function AddressRoute() {
    const [newAddress, setNewAddress] = useState<{ add: boolean, currentAddress?: Address }>({
        add: false
    })

    return (
        <>
            <Card className="p-8 lg:p-14 min-h-[75vh]">
                {
                    newAddress.add ?
                        <AddNewAddressForm
                            onCancel={() => setNewAddress({
                                add: false,
                            })}
                            onSaved={() => setNewAddress({
                                add: false
                            })}
                            address={newAddress.currentAddress}
                        />
                        : <AllAddresses setNewAddress={setNewAddress} />
                }
            </Card>
        </>
    )
}

interface AllAddressesProps {
    setNewAddress: Dispatch<SetStateAction<{
        add: boolean;
        currentAddress?: Address;
    }>>
}

function AllAddresses({ setNewAddress }: AllAddressesProps) {
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
                    isDefault: false
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
            toast.error(e.message)
        }
    }

    async function handleDelete() {
        try {
            await deleteAddress(deleteState.deleteId!);
            setAddresses((addresses) => addresses.filter((address) => address.id != deleteState.deleteId))
        } catch (e: any) {
            toast.error(e.message)
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
        <div className="grid lg:grid-cols-2 gap-4">
            <Dialog size="xs" open={deleteState.showDialog} handler={cancelDelete}>
                <DialogBody>Confirm to delete the current address?</DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        onClick={cancelDelete}
                        className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
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
                            <Typography
                                variant="small"
                                onClick={() => setNewAddress({
                                    add: true,
                                    currentAddress: address,
                                })}
                                className="invisible group-hover:visible hover:cursor-pointer hover:text-yellow-800 text-gray-900"
                            >
                                Edit
                            </Typography>
                        </div>
                    </div>)
            }

            <div
                onClick={() => setNewAddress({
                    add: true
                })}
                className="border border-gray-300 h-40 rounded flex flex-col justify-center items-center hover:border-gray-900 text-gray-400 hover:text-gray-900 hover:cursor-pointer"
            >
                <PlusIcon className="h-8 w-8" />
                <Typography variant="paragraph" color="gray">
                    Add a new address
                </Typography>
            </div>
        </div>
    )
}