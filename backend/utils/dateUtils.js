const { addDays, addWeeks, addMonths, startOfDay, endOfDay } = require('date-fns');

const calculateNextRunDate = (frequency) => {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      return addDays(now, 1);
    case 'weekly':
      return addWeeks(now, 1);
    case 'monthly':
      return addMonths(now, 1);
    default:
      return now;
  }
};

const getDateRange = (period) => {
  const now = new Date();
  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      };
    case 'week':
      return {
        start: startOfDay(addDays(now, -7)),
        end: endOfDay(now)
      };
    case 'month':
      return {
        start: startOfDay(addMonths(now, -1)),
        end: endOfDay(now)
      };
    default:
      return {
        start: now,
        end: now
      };
  }
};

module.exports = {
  calculateNextRunDate,
  getDateRange
}; 