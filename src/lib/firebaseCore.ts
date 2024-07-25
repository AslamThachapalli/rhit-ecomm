import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Firestore, getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

    async signUpWithEmailPassword(firstname: string, lastname: string, email: string, password: string) {
        const auth = getAuth();

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password)
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

    async signInWithEmailPassword(email: string, password: string) {
        const auth = getAuth();

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password)

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