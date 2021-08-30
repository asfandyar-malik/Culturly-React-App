import dayjs from "dayjs";
import moment from "moment";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const getWeekDays = (startDate, endDate) => {
  const weekDays = [];
  let delta = endDate.diff(startDate, "days");
  while (delta >= 0) {
    const day = startDate.day();
    if (day > 0 && day < 6) {
      weekDays.push({
        day: startDate.format("D"),
        dayName: startDate.format("ddd"),
        weekDay: startDate.format("DD-MMM"),
      });
    }
    startDate = startDate.add(1, "days");
    delta -= 1;
  }
  return weekDays;
};

export const getFormatTimezoneTime = (timeString, tz) => {
  return dayjs.utc(timeString, "HH:mm:ss").tz(tz).format("HH:mm");
};

export const getWeeksInMonth = (year, month) => {
  let count = 1;
  const weeks = [];
  const date = dayjs(`${year}-${month}`);
  const totalDays = parseInt(date.endOf("month").format("D"));
  let endDate = date;
  let startDate = date;
  let remainingDays = totalDays;

  while (remainingDays > 0) {
    let daysToMinus = endDate.endOf("week").add(1, "days").diff(date, "days");
    remainingDays = totalDays - daysToMinus;
    endDate = date.add(totalDays - remainingDays, "days");
    weeks.push({
      num: count,
      weekName: `Week ${count}`,
      startDay: startDate.format("D"),
      endDate: endDate.format("YYYY-MM-DD"),
      startDate: startDate.format("YYYY-MM-DD"),
    });
    count += 1;
    startDate = endDate.add(1, "days");
  }

  return weeks;
};

export const getMonthsBetweenDates = (startDate, endDate) => {
  const months = [];
  while (startDate.isBefore(endDate)) {
    months.push(startDate.format("YYYY-MM-01"));
    startDate = startDate.add(1, "month");
  }
  return months;
};

export const disabledFutureDate = (current) => {
  return current && current > moment().endOf("day");
};
