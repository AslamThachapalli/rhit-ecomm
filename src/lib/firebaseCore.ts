import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";
import { getAuth, Auth, } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

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
}

export const firebaseCore = FirebaseCore.instance;