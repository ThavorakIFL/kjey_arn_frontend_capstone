import { ReturnStatus } from "./return-status";

export type ReturnDetail = {
    id: number;
    return_date: string;
    return_time: string;
    return_location: string;
    return_detail_return_status: ReturnStatus;
};
