class View {
  _activitiesList = document.querySelector(".activities-list");
  _form = document.querySelector(".form");
  _nav = document.querySelector(".nav");
  _navLinks = document.querySelectorAll(".link-activity");
  dateInput = document.querySelector(".form__input--date");
  durationInput = document.querySelector(".form__input--duration");
  statsContainer = document.querySelector(".section-statistics");
  messageEl = document.querySelector(".message");
  calendarEl = document.querySelector(".calendar");

  renderMessage(message = "") {
    this.messageEl.textContent = message;
  }

  setFormInitialDate() {
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    this.dateInput.value = todayFormatted;
    this.dateInput.max = todayFormatted;
  }

  /////////////////////
  // PAGE RENDERING //
  ///////////////////

  addHandlerPageRender(handler) {
    ["hashchange", "load"].forEach((ev) => {
      window.addEventListener(
        ev,
        function (e) {
          // Setting default input value
          this.setFormInitialDate();

          const type = window.location.hash.slice(1);

          // Message rendering if there isn't any selected activity(type)
          if (!type) {
            this.renderMessage(
              "Start by choosing type of activity. Have fun! :)"
            );
            return;
          }

          // Navigation bar rendering (marking selected activity)
          const targetIndex = [...this._navLinks].findIndex(
            (link) => link.dataset.type === type
          );

          this._navLinks.forEach((link) =>
            link.classList.remove("link-activity--active")
          );

          this._navLinks[targetIndex].classList.add("link-activity--active");

          handler();
        }.bind(this)
      );
    });
  }

  ///////////////////////////
  //         FORM         //
  /////////////////////////

  clearForm() {
    this.durationInput.value = "";
    this.durationInput.blur();
    this.setFormInitialDate();
  }

  addHandlerForm(handler) {
    this._form.addEventListener(
      "submit",
      function (e) {
        e.preventDefault();

        const date = this.dateInput.value;
        const duration = Number(this.durationInput.value);

        if (!window.location.hash.slice(1)) {
          alert("Choose activity first!");
          this.clearForm();
          return;
        }
        if (!date) {
          alert("Choose date first!");
          this.clearForm();
          return;
        }

        if (!duration || duration <= 0 || !Number.isFinite(duration)) {
          alert("Wrong duration!");
          this.durationInput.value = "";
          this.durationInput.blur();
          return;
        }

        this.clearForm();

        handler(date, duration);
      }.bind(this)
    );
  }

  ////////////////////
  // ACTIVITY LIST //
  //////////////////

  renderActivityList(activity) {
    // Checking if there is any activity
    if (activity.length === 0) {
      this.renderMessage(
        "Insert your activity to see your activity history, calendar and summary :)"
      );
      this.messageEl.classList.remove("hidden");
      this.calendarEl.classList.add("hidden");
    } else {
      this.messageEl.classList.add("hidden");
      this.calendarEl.classList.remove("hidden");
    }

    // Generating activity list
    this._activitiesList.innerHTML = "";
    const markup = activity
      .map(
        (act) => `
            <li class="activity activity--programming" data-id="${act.id}">
           <h2>${act.description}</h2>
           <i class="ph-x-circle-fill activity-delete"></i>
         </li>
         `
      )
      .join("");
    this._activitiesList.insertAdjacentHTML("afterbegin", markup);
  }

  addHandlerDeleteClick(handler) {
    const deleteBtns = document.querySelectorAll(".activity-delete");
    deleteBtns.forEach((btn) =>
      btn.addEventListener("click", function (e) {
        const id = e.target.closest(".activity").dataset.id;
        handler(id);
      })
    );
  }

  ///////////////////////////
  // SUMMARY / STATISTICS //
  /////////////////////////

  renderSummary(summaries, streak) {
    const summaryElements = document.querySelectorAll(".summary");
    const streakEl = document.getElementById("day-streak");
    const weeklySumEl = document.getElementById("weekly-sum");
    const monthlySumEl = document.getElementById("monthly-sum");
    const annualSumEl = document.getElementById("annual-sum");

    const [weeklySum, monthlySum, annualSum] = summaries;

    streakEl.innerHTML = streak;
    weeklySumEl.innerHTML = weeklySum;
    monthlySumEl.innerHTML = monthlySum;
    annualSumEl.innerHTML = annualSum;

    summaryElements.forEach((sum) => sum.classList.remove("hidden"));
  }

  ///////////////////////////
  //       CALENDAR       //
  /////////////////////////

  renderCalendar(calendarData, activities) {
    const monthEl = document.querySelector(".month");
    const yearEl = document.querySelector(".year");
    const datesContainer = document.querySelector(".dates");

    const today = calendarData.today;
    const displayedMonth = calendarData.monthPage;
    const displayedYear = calendarData.yearPage;

    // prettier-ignore
    const months = [
      "January","February","March","April","May","June","July","August","September","October","November","December",
    ];

    // Establishing month layout
    const prevLastDay = new Date(displayedYear, displayedMonth, 0).getDate();
    const LastDay = new Date(displayedYear, displayedMonth + 1, 0).getDate();
    const FirstWeekday =
      new Date(displayedYear, displayedMonth, 1).getDay() - 1;

    // Rendering month layout
    let prevDatesHTML = "";
    for (let i = FirstWeekday; i >= 0; i--) {
      prevDatesHTML += `<div class="prev-date">${prevLastDay - i}</div>`;
    }

    let datesHTML = "";
    for (let i = 1; i <= LastDay; i++) {
      datesHTML += `<div class="date">${i}</div>`;
    }

    let nextDatesHTML = "";
    for (let i = 1; i < 42 - LastDay - FirstWeekday; i++) {
      nextDatesHTML += `<div class="next-date">${i}</div>`;
    }

    let html = prevDatesHTML + datesHTML + nextDatesHTML;

    datesContainer.innerHTML = html;

    // Marking activities on calendar//
    const datesEl = document.querySelectorAll(".date");

    const activityDates = activities.map((act) => new Date(act.date));
    const displayedDates = activityDates
      .filter(
        (date) =>
          date.getMonth() === displayedMonth &&
          date.getFullYear() === displayedYear
      )
      .map((date) => date.getDate());

    datesEl.forEach((date) => {
      if (displayedDates.includes(Number(date.textContent))) {
        date.classList.add("date-activity");
      }
    });

    // Marking today's date
    if (
      displayedMonth === today.getMonth() &&
      displayedYear === today.getFullYear()
    ) {
      datesEl[today.getDate() - 1].classList.add("today");
    }

    // Calendar description (month and year)
    monthEl.innerHTML = months[displayedMonth].toUpperCase();
    yearEl.innerHTML = displayedYear;
  }

  addHandlerArrowClick(handler) {
    const arrowsEl = document.querySelectorAll(".arrow");

    arrowsEl.forEach((arr) =>
      arr.addEventListener("click", function (e) {
        const target = e.target.closest(".arrow");
        const goTo = Number(target.dataset.goto);

        handler(goTo);
      })
    );
  }
}
export default new View();
