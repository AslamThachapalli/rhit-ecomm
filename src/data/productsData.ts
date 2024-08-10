import { 
    collection,
    getDocs, 
} from "firebase/firestore";
import { firebaseCore } from "../lib/firebaseCore";

const db = firebaseCore.db

export async function getAllProducts(): Promise<Product[]> {
    const ref = collection(db, 'products')
    const snaps = await getDocs(ref)

    let products: Product[] = []

    snaps.forEach((doc) => {
        products.push(doc.data() as Product)
    })

    return products
}