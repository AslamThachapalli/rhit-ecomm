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