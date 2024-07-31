import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { firebaseCore } from "../lib/firebaseCore";
import { v4 as uuidv4 } from 'uuid';
import cache from "../lib/cache";

export async function createAddress(address: Partial<Address>) {
    try {
        const id = uuidv4();
        address.id = id;

        const db = firebaseCore.db
        const docRef = doc(db, 'addresses', id)
        await setDoc(docRef, address);

        // update cache
        const value = cache.get('allAddresses', [])
        if (value) {
            value.push(address)
            cache.set('allAddresses', [], value)
        }
    } catch (e) {
        console.log(e)
        throw new Error('Failed to add address')
    }
}

export async function getAllAddress(userId: string) {
    try {
        let addresses: Address[] = []
        // const value = cache.get('allAddresses', [])
        // if (value) {
        //     addresses = value
        //     addresses.sort((x, y) => {
        //         return (x.isDefault === y.isDefault)? 0 : x.isDefault ? -1 : 1;
        //     })
        //     return addresses
        // }

        const db = firebaseCore.db;

        const q = query(collection(db, 'addresses'), where("userId", "==", userId), orderBy('isDefault', 'desc'))
        const querySnaps = await getDocs(q)

        querySnaps.forEach((doc) => {
            addresses.push(doc.data() as Address)
        })

        // cache.set('allAddresses', [], addresses.sort((x, y) => {
        //     return (x.isDefault === y.isDefault)? 0 : x.isDefault ? -1 : 1;
        // }))

        return addresses
    } catch (e) {
        console.log(e)
        throw new Error('Failed fetching address')
    }
}

export async function updateAddress(address: Partial<Address>) {
    try {
        const db = firebaseCore.db;

        if (!address?.id) {
            return;
        }

        const addressRef = doc(db, 'addresses', address.id)

        await updateDoc(addressRef, {
            ...address
        })
    } catch (e) {
        console.log(e)
        throw new Error('Failed to update address')
    }
}

export async function deleteAddress(addressId: string) {
    try {
        const db = firebaseCore.db;
        await deleteDoc(doc(db, 'addresses', addressId));
    } catch (e) {
        throw new Error('Failed to delete address')
    }
}