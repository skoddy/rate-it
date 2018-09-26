export class Post {
    createdAt: Date;
    content: string;
    author: Author;
}

export class Author {
    uid: string;
    displayName: string;
    photoURL: string;
}

export interface Roles {
    subscriber?: boolean;
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
    roles: Roles;
    darkmode?: boolean;
}
