import { MeetUpStatus } from "./meet-up-status";
import { Suggestions } from "./suggestions";

export type MeetUpDetail = {
    id: number;
    start_date: string;
    end_date: string;
    final_time?: string;
    final_location?: string;
    meet_up_detail_meet_up_status?: MeetUpStatus;
    suggestions?: Suggestions[];
};
