import { format, parseISO } from 'date-fns';

export const formatReadableDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return format(date, 'PPpp'); // e.g., Sep 21, 2023, 4:30:00 PM
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Invalid Date';
  }
};

 export const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy'); // e.g., Sep 21, 2023
    } catch (error) {
      console.error("Error formatting short date:", dateString, error);
      return 'Invalid Date';
    }
  };