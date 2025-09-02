// Updated types to match API response
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Facility {
    _id: string;
    name: string;
    address?: string;
}

export interface Review {
    _id: string;
    userId: User;
    facility: Facility;
    star: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
