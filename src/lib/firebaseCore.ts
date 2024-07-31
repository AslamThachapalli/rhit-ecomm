import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth } from "firebase/auth";
import { Firestore, getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Nullable } from "./globals";

class FirebaseCore {
    private static _instance: FirebaseCore;

    private app: FirebaseApp
    private _db: Firestore;
    private _auth: Auth

    private constructor() {
        this.app = initializeApp(firebaseConfig)
        this._db = getFirestore(this.app);
        this._auth = getAuth(this.app);
    }

    public static get instance() {
        if (!this._instance) {
            this._instance = new FirebaseCore();
        }

        return this._instance;
    }

    get db() {
        return this._db;
    }

    get auth() {
        return this._auth;
    }

    async currentUser(): Promise<Nullable<AppUser>> {

        const user = this._auth.currentUser;

        if (!user) {
            return null
        }

        const uid = user.uid;

        const docRef = doc(this._db, 'users', uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return docSnap.data() as AppUser
        } else {
            return null
        }
    }

    async signUpWithEmailPassword(firstname: string, lastname: string, email: string, password: string): Promise<AppUser> {
        try {
            const userCred = await createUserWithEmailAndPassword(this._auth, email, password)
            var uid = userCred.user.uid;

            var appUser: AppUser = {
                uid,
                firstname,
                lastname,
                email,
                phone: "",
                createdOn: Date.now(),
            }

            await setDoc(doc(this._db, 'users', uid), appUser)

            return appUser;
        } catch (error: any) {
            throw new Error(error.code);
        }
    }

    async signInWithEmailPassword(email: string, password: string): Promise<Nullable<AppUser>> {
        try {
            const userCred = await signInWithEmailAndPassword(this._auth, email, password)

            const docRef = doc(this._db, 'users', userCred.user.uid)
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
}

export const firebaseCore = FirebaseCore.instance;