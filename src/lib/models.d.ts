interface AppUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    createdOn: number;
    updatedOn: number;
}

// Date Refs
//
// var date = new Date();
// console.log(date);

// var dateMilli = Date.now();
// console.log(dateMilli)

// var d = new Date(dateMilli).toLocaleDateString('en-GB');
// console.log(d)

interface Address {
    id: string;
    userId: string;
    isDefault: boolean;
    name: string;
    phone: string;
    email: string;
    pincode: string;
    city: string;
    state: string;
    address: string;
    landmark: string;
}

interface Product {
    id: string;
    name: string;
    categoryId: string;
    price: number;
    stockQuantity: number;
}

interface Category {
    id: string;
    categoryName: string;
}

interface Cart {
    id: string;
    userId: string;
    cartItems: CartItem[];
    quantity: number;
}

interface CartItem {
    productId: string;
    quantity: number;
    price: number;
}

type OrderStatus = 'created' | 'attempted' | 'paid';

interface Order {
    id: string;
    userId: string;
    providerOrderId: string;
    status: OrderStatus;
    addressId: string;
    totalAmount: number;
    createdAt: number;
    updatedAt: number;
    orderItems: OrderItem[];
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

type PaymentStatus = "created" | "authorized" | "captured" | "refunded" | "failed";

interface Payment {
    id: string;
    userId: string;
    providerPaymentId: string;
    orderId: string;
    status: PaymentStatus;
    createdAt: number;
    updatedAt: number;
}