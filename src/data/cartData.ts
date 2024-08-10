import { collection, deleteDoc, doc, getDoc, getDocs, increment, query, setDoc, updateDoc, where } from "firebase/firestore";
import { firebaseCore } from "../lib/firebaseCore";
import { v4 as uuidv4 } from 'uuid';

const db = firebaseCore.db;

export async function createCart(userId: string): Promise<Cart> {
    try {
        const cartId = uuidv4();

        const cartRef = doc(db, 'carts', cartId)
        await setDoc(cartRef, {
            id: cartId,
            userId,
            quantity: 0,
        });

        return {
            id: cartId,
            userId,
            cartItems: [],
            quantity: 0,
        }
    } catch (e) {
        throw new Error('Oops! Failed creating a cart for you')
    }
}

export async function getCart(userId: string): Promise<Cart> {
    const qc = query(collection(db, 'carts'), where("userId", "==", userId))
    const qcSnaps = await getDocs(qc)

    if (qcSnaps.empty) {
        const cart = await createCart(userId);
        return cart;
    }

    const cartFromDb = qcSnaps.docs[0].data() as Partial<Cart>

    let cartItems: CartItem[] = []

    let cart: Cart = {
        id: cartFromDb.id!,
        userId: cartFromDb.userId!,
        cartItems,
        quantity: 0,
    }

    const qcItem = query(collection(db, 'carts', cartFromDb.id!, 'cartItems'))
    const qcItemSnaps = await getDocs(qcItem);

    if (qcItemSnaps.empty) {
        return cart;
    }

    qcItemSnaps.forEach((doc) => {
        cartItems.push(doc.data() as CartItem)
    })

    cart.cartItems = cartItems

    return cart;
}

export async function addToCart(cartId: string, item: CartItem) {
    try {
        const cartRef = doc(db, 'carts', cartId)
        await updateDoc(cartRef, {
            quantity: increment(1)
        })

        const itemDocRef = doc(db, 'carts', cartId, 'cartItems', item.productId)
        await setDoc(itemDocRef, item)
    } catch (e) {
        throw new Error('Failed adding to Cart')
    }
}

export async function modifyCartItemCount({ cartId, productId, action }: { cartId: string, productId: string, action: 'increment' | 'decrement' }) {
    try {
        const cartRef = doc(db, 'carts', cartId)
        await updateDoc(cartRef, {
            quantity: increment(action == 'increment' ? 1 : -1)
        })

        const itemDocRef = doc(db, 'carts', cartId, 'cartItems', productId)
        await updateDoc(itemDocRef, {
            quantity: increment(action == 'increment' ? 1 : -1)
        })
    } catch (e) {
        throw new Error('Failed modifying your cart')
    }
}

export async function removeFromCart({ cartId, productId }: { cartId: string, productId: string }) {
    try {
        const itemDocRef = doc(db, 'carts', cartId, 'cartItems', productId)
        const itemSnap = await getDoc(itemDocRef)
        const { quantity: itemCount } = itemSnap.data() as CartItem
        await deleteDoc(itemDocRef)

        const cartRef = doc(db, 'carts', cartId)
        await updateDoc(cartRef, {
            quantity: increment(-itemCount)
        })
    } catch (e) {
        throw new Error('Failed removing from cart')
    }
}