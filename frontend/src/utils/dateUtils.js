export const formatTime = (time) => {
    if (!time) return '-';

    // Check if it's already in 12-hour format (e.g., "01:00 PM")
    if (String(time).match(/AM|PM/i)) return time;

    const [hours, minutes] = String(time).split(':');

    // Validate parsing
    if (isNaN(hours) || isNaN(minutes)) {
        // Try parsing as Date object
        const date = new Date(time);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return time; // Fallback
    }

    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    const formattedMinute = m < 10 ? `0${m}` : m;

    return `${formattedHour}:${formattedMinute} ${ampm}`;
};
