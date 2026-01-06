import { MONTH_NAMES } from '@/config/config';

export const formatDate = (inputDate: string) => {
  const defaultResult = {
    full: '',
    monthYear: '',
    day: 0,
    month: '',
    year: 0,
  };

  if (!inputDate) return defaultResult;

  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const parts = inputDate.split('-');

  let date: Date;

  // Detect format YYYY-MM-DD or DD-MM-YYYY
  if (parts[0].length === 4) {
    date = new Date(+parts[0], +parts[1] - 1, +parts[2]);
  } else {
    date = new Date(+parts[2], +parts[1] - 1, +parts[0]);
  }

  const year = date.getFullYear();
  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const suffix = getDaySuffix(day);

  return {
    full: `${day}${suffix} ${month} ${year}`,
    monthYear: `${month} ${year}`,
    day,
    month,
    year,
  };
};
