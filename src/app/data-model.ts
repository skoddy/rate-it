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
    classRef?: DocumentReference;
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
    studentRef: DocumentReference;
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
    id?: string;
    teacherRef: DocumentReference;
    classRef: DocumentReference;
    moduleRef: DocumentReference;
    start: Date;
    end: Date;
    status: string;
    studentsDone?: number;
    students: Array<string>;
    createdAt: Date;
    endedAt?: Date;
    average?: {
        documents: number;
        equipment: number;
        evaluations: number;
        exercises: number;
        software: number;
        support: number;
        working_climate: number;
    };
    r_documents: [number, number, number, number, number, number, number];
    r_equipment: [number, number, number, number, number, number, number];
    r_evaluations: [number, number, number, number, number, number, number];
    r_exercises: [number, number, number, number, number, number, number];
    r_software: [number, number, number, number, number, number, number];
    r_support: [number, number, number, number, number, number, number];
    r_working_climate: [number, number, number, number, number, number, number];
    grades?: {
        one: number;
        two: number;
        three: number;
        four: number;
        five: number;
        six: number;
    };
}
