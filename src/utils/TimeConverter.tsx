export default function formatTimeString(timeString: string): string {
    try {
        if (!timeString) return "";

        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours, 10);

        if (isNaN(hour)) return "";

        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;

        return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
        console.error("Failed to format time string:", error);
        return "";
    }
}
