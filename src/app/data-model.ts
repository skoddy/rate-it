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
    className?: string;
    roles: Roles;
}

export interface Class {
    id?: string;
    name: string;
    info: string;
}

export interface Modul {
    id?: string;
    name: string;
}

export interface Rating {
    teacher: string;
    className: string;
    moduleName: string;
    start: Date;
    end: Date;
}
