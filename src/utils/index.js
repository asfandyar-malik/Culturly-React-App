import dayjs from "dayjs";
import moment from "moment";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
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
  const dayjsDate = dayjs(`${year}-${month}`);
  let startWeekDate = dayjsDate.clone().startOf("week");

  const totalDays = parseInt(dayjsDate.endOf("month").format("D"));

  let endDate = dayjsDate;
  let startDate = dayjsDate;
  let remainingDays = totalDays;

  if (startWeekDate.format("M") !== month) {
    startDate = dayjsDate.clone().startOf("month");
    startWeekDate = dayjsDate.clone().startOf("month");
  } else {
    startDate = startWeekDate;
  }

  if (startDate.format("d") === "0") {
    startDate = startDate.add(1, "days");
  }

  while (remainingDays > 0) {
    let daysToMinus = endDate
      .endOf("week")
      .add(1, "days")
      .diff(startWeekDate, "days");
    remainingDays = totalDays - daysToMinus;
    endDate = startWeekDate.add(totalDays - remainingDays, "days");
    weeks.push({
      num: count,
      weekName: `Week ${count}`,
      endDay: endDate.format("D"),
      startDay: startDate.format("D"),
      endDate: endDate.format("YYYY-MM-DD"),
      startDate: startDate.format("YYYY-MM-DD"),
      format: `Week (${startDate.format("Do MMM")} - ${endDate.format(
        "Do MMM"
      )})`,
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

export const getEventCover = (eventDetail) => {
  let cover = `https://api.platterz.ca/files/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBakFLIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5e1428f61658f03d2278acb28ddfe85d9ed6edca/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBPZ2wzWldKd09neHhkV0ZzYVhSNWFWVTZDMlJsWm1sdVpVa2lGM2RsWW5BNmJHOXpjMnhsYzNNOWRISjFaUVk2QmtWVSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--98ef3d9b0eb9f3ddeb642efd51c271930315995c/vx_covers_holistic_corporate_wellness_program.jpg`;
  const { pictures = [] } = eventDetail;
  if (pictures.length) {
    cover = pictures[0].picture_url;
  }
  return cover;
};

export const groupByDate = (data) => {
  return data.reduce((groups, item) => {
    const date = item.created_at.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
};
