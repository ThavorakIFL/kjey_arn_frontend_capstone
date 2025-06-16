import { SuggestionStatus } from "./suggestion-status";
import { User } from "./user";

export type Suggestions = {
    id: number;
    meet_up_detail_id: number;
    suggested_by: number;
    suggested_time: string;
    suggested_location: string;
    suggested_reason: string;
    suggestion_status?: SuggestionStatus[];
    created_at: string;
    updated_at: string;
    user?: User;
};
