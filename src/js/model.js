import { summary } from "date-streaks";

export let state = {
  activities: {
    programming: [],
    sports: [],
    reading: [],
    sleep: [],
  },
  calendar: {
    today: new Date(),
    monthPage: new Date().getMonth(),
    yearPage: new Date().getFullYear(),
  },
};

export class Activity {
  constructor(type, dateStr, duration) {
    this.type = type;
    this.date = dateStr;
    this.duration = duration; //in hours
    this.id = (Date.now() + "").slice(-10);
    this._setDescription();
  }

  _setDescription() {
    const dateFormatted = new Date(this.date);

    // prettier-ignore
    const months = [
      "January","February","March","April","May","June","July","August","September","October","November","December",
    ];

    let emoji = "";
    if (this.type === "programming") emoji = "💻";
    if (this.type === "sports") emoji = "🏋️";
    if (this.type === "reading") emoji = "📚";
    if (this.type === "sleep") emoji = "😴";

    this.description = `${emoji}&nbsp;&nbsp; ${this.type
      .slice(0, 1)
      .toUpperCase()}${this.type.slice(1)} on ${
      months[dateFormatted.getMonth()]
    } ${dateFormatted.getDate()} (${this.duration}h)  ​`;
  }
}

export const addActivity = function (type, date, duration) {
  // 1. Push new activity
  state.activities[type].push(new Activity(type, date, duration));

  // 2. Sorting activities
  state.activities[type].sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? 1 : -1
  );
};

export const deleteActivity = function (type, id) {
  state.activities[type] = state.activities[type].filter(
    (act) => act.id !== id
  );
};

export const calculateStreak = function (type) {
  const dates = state.activities[type].map((act) => act.date);

  const streakData = summary({ dates });
  const { currentStreak } = streakData;

  return currentStreak;
};

// DO POPRAWY /////////////////////////////
// Zrobić ładniejszą funckję
export const calculateSummary = function (type) {
  const today = state.calendar.today;

  // WEEKLY
  const weeklySum = state.activities[type]
    .filter(
      (act) =>
        new Date(act.date).getDate() >= today.getDate() - today.getDay() &&
        new Date(act.date).getMonth() === today.getMonth() &&
        new Date(act.date).getYear() === today.getYear()
    )
    .reduce((acc, cur) => acc + cur.duration, 0);

  //MONTHLY
  const monthlySum = state.activities[type]
    .filter(
      (act) =>
        new Date(act.date).getMonth() === today.getMonth() &&
        new Date(act.date).getYear() === today.getYear()
    )
    .reduce((acc, cur) => acc + cur.duration, 0);

  //ANNUAL
  const annualSum = state.activities[type]
    .filter((act) => new Date(act.date).getYear() === today.getYear())
    .reduce((acc, cur) => acc + cur.duration, 0);

  return [weeklySum, monthlySum, annualSum];
};

export const setCalendarPage = function (goTo) {
  state.calendar.monthPage += goTo;
  if (state.calendar.monthPage < 0) {
    state.calendar.monthPage = 11;
    state.calendar.yearPage--;
  }

  if (state.calendar.monthPage > 11) {
    state.calendar.monthPage = 0;
    state.calendar.yearPage++;
  }
};

////////////////////////////////////////
// SET / GET / DELETE LOCAL STORAGE

export const setLocalStorage = function () {
  localStorage.setItem("state", JSON.stringify(state));
};

export const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("state"));

  if (!data) return;

  state = data;

  state.calendar = {
    today: new Date(),
    monthPage: new Date().getMonth(),
    yearPage: new Date().getFullYear(),
  };
};

export const deleteLocalStorage = function () {
  localStorage.removeItem("state");
  location.reload();
};
// deleteLocalStorage();
