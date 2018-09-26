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
    owner?: boolean;
    admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    roles: Roles;
    darkmode?: boolean;
}