export default function formatDateString(dateString: string): string {
    try {
        // Check if the input string matches expected format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            throw new Error("Invalid date format. Expected yyyy-mm-dd");
        }

        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString; // Return original string if there's an error
    }
}
