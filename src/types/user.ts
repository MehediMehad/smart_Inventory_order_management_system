export interface IAuthUser {
    userId: string;
    name: string;
    email: string;
    hasShop?: boolean;
    isActive?: boolean;
    role: "user" | "admin";
    iat?: number;
    exp?: number;
}


export type TGetMyInfo = {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
    contactNumber: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    role: 'ADMIN' | 'ORGANIZER' | 'USER';
    status: 'ACTIVE' | 'BLOCKED';
    createdAt: string;
    updatedAt: string;
};

export interface TMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface TUsers {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    status: "ACTIVE" | "BLOCKED" | "PENDING";
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
}

export interface TUser {
    id: string
    name: string
    email: string
    phone: string
    role: string
    image: string
    isVerified: boolean
    status: string
    createdAt: string
}
