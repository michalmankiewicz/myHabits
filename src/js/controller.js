// if (module.hot) {
//   module.hot.accept(function () {
//     window.location.reload();
//   });
// }

import * as model from "./model.js";
import View from "./view.js";

const controlPageUpdate = function () {
  const type = window.location.hash.slice(1);

  // STREAK CALCULATION AND RENDERING
  const streak = model.calculateStreak(type);
  const summaries = model.calculateSummary(type);
  View.renderSummary(summaries, streak);

  // ACTIVITY LIST RENDERING
  View.renderActivityList(model.state.activities[type]);

  // DELETE BUTTONS HANDLER
  View.addHandlerDeleteClick(controlDeleteActivity);

  // CALENDAR RENDERING
  View.renderCalendar(model.state.calendar, model.state.activities[type]);
};

const controlAddActivity = function (date, duration) {
  const type = window.location.hash.slice(1);

  model.addActivity(type, date, duration);

  model.setLocalStorage();

  controlPageUpdate();
};

const controlDeleteActivity = function (id) {
  const type = window.location.hash.slice(1);

  model.deleteActivity(type, id);

  model.setLocalStorage();

  controlPageUpdate();
};

const controlCalendar = function (goTo) {
  const type = window.location.hash.slice(1);

  model.setCalendarPage(goTo);

  View.renderCalendar(model.state.calendar, model.state.activities[type]);
};

const init = function () {
  model.getLocalStorage();
  View.addHandlerForm(controlAddActivity);
  View.addHandlerPageRender(controlPageUpdate);
  View.addHandlerArrowClick(controlCalendar);
};

init();
