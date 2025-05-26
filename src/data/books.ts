import { Book } from "@/types/book";
import { Genre } from "@/types/genre";
import { Users } from "@/data/users";
import { BookStatus } from "@/types/availability";

export const Books: Book[] = [
    {
        id: "1",
        title: "The Alchemist",
        author: "Paulo Coelho",
        availability: BookStatus.Available,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
            "https://ae01.alicdn.com/kf/S6ca80a0a9df94df7ba968219319b3d40u.jpg",
            "https://media.licdn.com/dms/image/v2/D4D12AQH17LBlvM-TQg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1680304161750?e=2147483647&v=beta&t=HkEHhZRmaJdo1VjspuM26siEcHEBXOBYolx1JR-zn1I",
        ],
        genre: Genre.Biography,
        condition: "20",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
    {
        id: "2",
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K Rowling",
        availability: BookStatus.Unavailable,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images.booksense.com/images/427/353/9780590353427.jpg",
        ],
        genre: Genre.Biography,
        condition: "100",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
    {
        id: "3",
        title: "The Alchemist is a novel by Brazilian ",
        author: "Paulo Coelho",
        availability: BookStatus.Available,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
            "https://ae01.alicdn.com/kf/S6ca80a0a9df94df7ba968219319b3d40u.jpg",
            "https://media.licdn.com/dms/image/v2/D4D12AQH17LBlvM-TQg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1680304161750?e=2147483647&v=beta&t=HkEHhZRmaJdo1VjspuM26siEcHEBXOBYolx1JR-zn1I",
        ],
        genre: Genre.Biography,
        condition: "100",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
    {
        id: "4",
        title: "The Alchemist",
        author: "Paulo Coelho",
        availability: BookStatus.Available,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
        ],
        genre: Genre.Biography,
        condition: "100",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
    {
        id: "5",
        title: "The Alchemist",
        author: "Paulo Coelho",
        availability: BookStatus.Available,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
            "https://ae01.alicdn.com/kf/S6ca80a0a9df94df7ba968219319b3d40u.jpg",
            "https://media.licdn.com/dms/image/v2/D4D12AQH17LBlvM-TQg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1680304161750?e=2147483647&v=beta&t=HkEHhZRmaJdo1VjspuM26siEcHEBXOBYolx1JR-zn1I",
        ],
        genre: Genre.Biography,
        condition: "100",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
    {
        id: "6",
        title: "The Alchemist",
        author: "Paulo Coelho",
        availability: BookStatus.Available,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
        ],
        genre: Genre.Biography,
        condition: "100",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
    {
        id: "7",
        title: "The Alchemist",
        author: "Paulo Coelho",
        availability: BookStatus.Available,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
            "https://ae01.alicdn.com/kf/S6ca80a0a9df94df7ba968219319b3d40u.jpg",
            "https://media.licdn.com/dms/image/v2/D4D12AQH17LBlvM-TQg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1680304161750?e=2147483647&v=beta&t=HkEHhZRmaJdo1VjspuM26siEcHEBXOBYolx1JR-zn1I",
        ],
        genre: Genre.Biography,
        condition: "100",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
    {
        id: "8",
        title: "The Alchemist",
        author: "Paulo Coelho",
        availability: BookStatus.Available,
        description:
            "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
        images: [
            "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
        ],
        genre: Genre.Biography,
        condition: "100",
        uploadedAt: "2021-10-10",
        uploadedBy: Users[0],
    },
];
