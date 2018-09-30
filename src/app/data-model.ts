export interface Roles {
    admin?: boolean;
    office?: boolean;
    teacher?: boolean;
    student?: boolean;
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: Date;
    roles: Roles;
}

export interface Class {
    name: string;
    start: Date;
    end: Date;
    createdAt: Date;
    info: string;
}
