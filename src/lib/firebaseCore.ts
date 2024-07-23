import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { Firestore, getFirestore } from "firebase/firestore/lite";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

class FirebaseCore {
    private static _instance: FirebaseCore;

    private app: FirebaseApp
    private _db: Firestore;

    private constructor() {
        this.app = initializeApp(firebaseConfig)
        this._db = getFirestore(this.app);
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

    async signUpWithEmailPassword(email: string, password: string) {
        const auth = getAuth();

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password)
            return userCred.user;
        } catch (error: any) {
            throw new Error(error.code);
        }
    }

    async signInWithEmailPassword(email: string, password: string) {
        const auth = getAuth();

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password)
            return userCred.user;
        } catch (error: any) {
            throw new Error(error.code);
        }
    }
}

export const firebaseCore = FirebaseCore.instance;