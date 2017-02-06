const stopwatchesHTML = document.querySelector(".stopwatches");
const addStopwatches = document.querySelector(".add-stopwatches");
const storedStopwatches = JSON.parse(localStorage.getItem("stopwatches"));
let stopwatches = storedStopwatches || {};
let stopwatchIdIndex = storedStopwatches ? Object.keys(storedStopwatches).length : 0;
let saveInterval;

function increaseTime(index) {
  var stopwatch = stopwatches[index];
  stopwatch.seconds++;

  if (stopwatch.seconds >= 60) {
    stopwatch.minutes++;
    stopwatch.seconds = 0;

    if (stopwatch.minutes >= 60) {
      stopwatch.minutes = 0;
      stopwatch.hours++;
    }
  }
  updateTimer(stopwatch, index);
}

function padTimeWithZero(time) {
  return time ? (time > 9 ? time : "0" + time) : "00";
}

function getTime(stopwatch) {

  return {
    hours : padTimeWithZero(stopwatch.hours),
    minutes : padTimeWithZero(stopwatch.minutes),
    seconds : padTimeWithZero(stopwatch.seconds)
  }
}

function updateTimer(stopwatch, index) {
  const listItem = document.querySelector(`#stopwatch-${index}`);
  const time = getTime(stopwatch);
  listItem.textContent = time.hours + ":" + time.minutes + ":" + time.seconds;
}

function toggleStopwatch(e) {
  const element = e.target;

  if (!element.className.includes("time")) return;

  const index = element.dataset.index;
  const item = stopwatches[index];

  if (item.active) {
    clearInterval(item.timer);
    element.classList.remove("mdl-button--colored");
    element.classList.add("mdl-button--accent");
  } else {
    element.classList.remove("mdl-button--accent");
    element.classList.add("mdl-button--colored");
    item.timer = setInterval(increaseTime, 1000, index);
  }

  item.active = !item.active;
}

function createStopwatchListItem(stopwatch, index) {
  let listItem = document.createElement("li");
  let labelStopwatchName = createStopwatchNameLabel(stopwatch.text);
  let buttonStopwatchTime = createStopwatchButton(stopwatch, index);
  let buttonRemoveStopwatch = createRemoveButton(index);
  let buttonResetStopwatch = createRefreshButton(index);

  listItem.id = `item-${index}`;
  listItem.setAttribute("class", "mdl-list__item");

  listItem.appendChild(labelStopwatchName);
  listItem.appendChild(buttonStopwatchTime);
  listItem.appendChild(buttonResetStopwatch);
  listItem.appendChild(buttonRemoveStopwatch);

  return listItem;
}

function createStopwatchNameLabel(text) {
  let labelStopwatchName = document.createElement("label");
  labelStopwatchName.innerHTML = text;
  labelStopwatchName.setAttribute("class", "stopwatch-name mdl-cell mdl-cell--8-col");

  return labelStopwatchName;
}

function createStopwatchButton(stopwatch, index) {
  let buttonStopwatchTime = document.createElement("button");
  buttonStopwatchTime.dataset.index = index;
  buttonStopwatchTime.id = `stopwatch-${index}`;
  buttonStopwatchTime.setAttribute("class", "time time-inactive mdl-button mdl-js-button mdl-button--raised mdl-button--accent");
  const time = getTime(stopwatch);
  buttonStopwatchTime.innerHTML = time.hours + ":" + time.minutes + ":" + time.seconds;

  return buttonStopwatchTime;
}

function createIcon(iconName) {
  let icon = document.createElement("i");
  icon.setAttribute("class", "material-icons");
  icon.innerHTML = iconName;

  return icon;
}

function createRefreshButton(index) {
  let buttonResetStopwatch = document.createElement("button");
  let iconRefresh = createIcon("refresh");
  buttonResetStopwatch.setAttribute("class", "stopwatch-option mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab");
  buttonResetStopwatch.addEventListener("click", function(){
    resetStopwatch(index)
    this.blur();
  });
  buttonResetStopwatch.appendChild(iconRefresh);

  return buttonResetStopwatch;
}

function createRemoveButton(index) {
  let buttonRemoveStopwatch = document.createElement("button");
  let iconRemove = createIcon("remove");
  buttonRemoveStopwatch.setAttribute("class", "stopwatch-option mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab");
  buttonRemoveStopwatch.addEventListener("click", function(){deleteStopwatch(index)});
  buttonRemoveStopwatch.appendChild(iconRemove);

  return buttonRemoveStopwatch;
}

function createStopwatch(text) {
  return {
    active : false,
    hours : 0,
    minutes : 0,
    seconds : 0,
    text : text,
    timer : null
  };
}

function addStopwatch(e){
  e.preventDefault();
  const taskInput = this.querySelector("[name=item]");
  const text = taskInput.value;
  stopwatches[stopwatchIdIndex] = createStopwatch(text);
  const listItem = createStopwatchListItem(stopwatches[stopwatchIdIndex], stopwatchIdIndex);
  stopwatchesHTML.appendChild(listItem);
  stopwatchIdIndex++;
  this.reset();
  taskInput.parentElement.classList.remove("is-focus", "is-dirty");
  setAutoSave();
}

function setAutoSave() {
  if (!saveInterval && Object.keys(stopwatches).length > 0) {
    saveInterval = setInterval(saveData, 2000);
  }
}

function deleteStopwatch(elementId) {
  clearInterval(stopwatches[elementId].timer);
  delete stopwatches[elementId];
  const item = document.getElementById(`item-${elementId}`);
  stopwatchesHTML.removeChild(item);

  if (Object.keys(stopwatches).length == 0) {
    localStorage.setItem("stopwatches", JSON.stringify(stopwatches));
    clearInterval(saveInterval);
  }

}

function resetStopwatch(elementId) {
  var stopwatch = stopwatches[elementId];
  clearInterval(stopwatch.timer);
  stopwatch.seconds = 0;
  stopwatch.minutes = 0;
  stopwatch.hours = 0;
  let stopwatchButton = document.getElementById(`stopwatch-${elementId}`);
  const time = getTime(stopwatch);
  stopwatchButton.innerHTML = time.hours + ":" + time.minutes + ":" + time.seconds;
  stopwatchButton.classList.remove("mdl-button--colored");
  stopwatchButton.classList.add("mdl-button--accent");
}

function saveData() {
  localStorage.setItem("stopwatches", JSON.stringify(stopwatches));
}

function populateList(){
  setAutoSave();

  for (var key in stopwatches) {
    const listItem = createStopwatchListItem(stopwatches[key], key);
    stopwatchesHTML.appendChild(listItem);
  }
}

stopwatchesHTML.addEventListener("click", toggleStopwatch);
addStopwatches.addEventListener("submit", addStopwatch);
populateList();

