import { User } from "./user";

export type Suggestions = {
    id: number;
    meet_up_detail_id: number;
    suggested_by: number;
    suggested_time: string;
    suggested_location: string;
    suggested_reason: string;
    created_at: string;
    updated_at: string;
    user?: User;
};
