import { Genre } from "./genre";
import { Picture } from "./picture";
import { Availability } from "./availability";
import { User } from "./user";

export type Book = {
    id: number;
    user_id: number;
    title: string;
    author: string;
    condition: number;
    status?: number;
    description: string;
    created_at: string;
    updated_at: string;
    genres: Genre[];
    pictures: Picture[];
    availability: Availability;
    user?: User;
};
