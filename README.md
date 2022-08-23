# myHabits Project

## Description
myHabits application is my first deployed project which allows users to track four following activities: programming, sports, reading books and sleep. Project includes calendar, activity list (sorted by date) and statistics section with information about activity's streaks and sums.

Tech Stack:Tech Stack: HTML, CSS, JS ES6, Parcel, NPM, GIT

Architecture: MVC

External Library: date-streaks (https://github.com/jonsamp/date-streaks#readme)

## How to use?

1. Choose one of activities by clicking corresponding button.
2. Choose your activity's date and duration and then submit the form by clicking "Enter".
3. Now you can add new activity, delete previously inserted or check activity's calendar and statistics. 

## Features

### Adding, deleting new activity,
Each time user is inserting activity by sumbiting a form the new Activity object is created. Then depending of type of activity (programming, sports, reading, sleep) activity is pushed to state object in corresponding type. 

Activity object consist of type, date, duration, id and description.

Deleteing activity can be achieved by clicking cross in top-right corner of each activity. Then depending of type of activity (programming, sports, reading, sleep) actvity is slice from array (by use of id).

### List rendering
List of activities is rendered each time state.actvities array is updated. By use of sort() method, list is sorted due to activities dates.

### Form
Form allow user to create new activity only when both of values (date, duration) are inserted and duration is higher than zero.
 
### Calendar rendering
Calendar is programmed from the scratch and show user today's date and all activities in current or past month.

### Statistics
Statistics section allow user to check duration summary (weekly, monthly, annualy) and activity's streak. Summary is calculated in my code with use of filter and reduce methods. Whereas current streak value is achieved by use of 'date-streak' library.

