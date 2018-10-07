import { DocumentReference } from '@angular/fire/firestore';

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

export interface SubmittedRating {
    documents: number;
    exercises: number;
    software: number;
    support: number;
    evaluations: number;
    working_climate: number;
    equipment: number;
    suggestions?: string;
}

export interface Rating {
    teacherRef: DocumentReference;
    classRef: DocumentReference;
    moduleRef: DocumentReference;
    start: Date;
    end: Date;
}
