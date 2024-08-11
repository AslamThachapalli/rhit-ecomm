import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseCore } from "../lib/firebaseCore";
import { Nullable } from "../lib/globals";

const db = firebaseCore.db;
const auth = firebaseCore.auth;

export async function currentUser(): Promise<Nullable<AppUser>> {

    const user = auth.currentUser;

    if (!user) {
        return null
    }

    const id = user.uid;

    const docRef = doc(db, 'users', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return docSnap.data() as AppUser
    } else {
        return null
    }
}

export async function signUpWithEmailPassword(firstname: string, lastname: string, email: string, password: string): Promise<AppUser> {
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password)
        var id = userCred.user.uid;

        var appUser: AppUser = {
            id,
            firstname,
            lastname,
            email,
            phone: "",
            createdOn: Date.now(),
            updatedOn: Date.now(),
        }

        await setDoc(doc(db, 'users', id), appUser)

        return appUser;
    } catch (error: any) {
        throw new Error(error.code);
    }
}

export async function signInWithEmailPassword(email: string, password: string): Promise<Nullable<AppUser>> {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password)

        const docRef = doc(db, 'users', userCred.user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data() as AppUser
        } else {
            return null
        }
    } catch (error: any) {
        throw new Error(error.code);
    }
}

export async function signOutUser() {
    signOut(auth);
}