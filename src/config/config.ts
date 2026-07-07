export const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const formatDateToReadable = (
    finalDate?: string | null
): string => {
    if (!finalDate) return "";

    const parts = finalDate.split("-");

    if (parts.length !== 3) return "";

    let year: number;
    let month: number;
    let day: number;

    // Case 1: YYYY-MM-DD
    if (parts[0].length === 4) {
        year = Number(parts[0]);
        month = Number(parts[1]) - 1;
        day = Number(parts[2]);
    }
    // Case 2: DD-MM-YYYY
    else {
        year = Number(parts[2]);
        month = Number(parts[1]) - 1;
        day = Number(parts[0]);
    }

    const date = new Date(year, month, day);

    // Invalid date safeguard
    if (Number.isNaN(date.getTime())) return "";

    return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

export const APPIMAGES = {
    BG1: "/images/bg/bg_1.jpg",
    BG1_MOB: "/images/bg/bg_1_mob.jpg",
};