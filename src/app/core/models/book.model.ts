export interface Book {
    id?: number;
    title: string;
    author: string;
    description: string;
    dueDate?: string;
    borrowerId?: string;
    isbn?: string;
    publishedYear?: number;
    coverImageUrl?: string;
    isAvailable?: boolean;
    status?:string;

}
