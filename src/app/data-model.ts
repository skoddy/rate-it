export interface Roles {
    admin?: boolean;
    office?: boolean;
    teacher?: boolean;
    student?: boolean;
}

export interface User {
    uid: string;
    email: string;
    title: string;
    displayName: string;
    photoURL: string;
    createdAt: Date;
    classId?: string;
    roles: Roles;
}

export interface Class {
    id?: string;
    name: string;
    info: string;
    students: number;
}

export interface Modul {
    id?: string;
    name: string;
}

export interface Rating {
    teacher: string;
    classId: string;
    moduleName: string;
    start: Date;
    end: Date;
}
