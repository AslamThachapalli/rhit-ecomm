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
    alternateNumber: string;
    email: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
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

type OrderStatus = 'pending' | 'cancelled' | 'failed' | 'unverified' | 'paid' | 'refund initiated' | 'refunded' | 'refund failed';

interface Order {
    id: string;
    userId: string;
    providerOrderId: string;
    paymentId?: string;
    status: OrderStatus;
    addressId: string;
    totalAmount: number;
    quantity: number;
    orderItems: OrderItem[];
    deliveryId?: string;
    shippingId?: string;
    isRefunded?: boolean;
    refundId?: string;
    createdOn: number;
    updatedOn?: number;
    cancelledOn?: number;
    failedOn?: number;
    paidOn?: number;
    refundInitiatedOn?: number;
    refundedOn?: number;
    deliveredOn?: number;
    returnInitiatedOn?: number;
    returnedOn?: number;
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}