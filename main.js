 const stopwatchesHTML = document.querySelector(".stopwatches");
  const addStopwatches = document.querySelector(".add-stopwatches");
  const timePlaceholder = "00:00:00";
  let stopwatches = {};
  let stopwatchIdIndex = 0;

  function increaseTime(index) {
    var item = stopwatches[index];
    item.seconds++;

    if (item.seconds >= 60) {
      item.minutes++;
      item.seconds = 0;

      if (item.minutes >= 60) {
        item.minutes = 0;
        item.hours++;
      }
    }
    updateTimer(index);
  }

  function formatTime(time) {
    return time ? (time > 9 ? time : "0" + time) : "00";
  }

  function updateTimer(index) {
    const hoursText = formatTime(stopwatches[index].hours);
    const minutesText = formatTime(stopwatches[index].minutes);
    const secondsText = formatTime(stopwatches[index].seconds);
    const listItem = document.querySelector(`#stopwatch-${index}`);
    listItem.textContent = hoursText + ":" + minutesText + ":" + secondsText;
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

  function createStopwatchListItem(text) {
    let listItem = document.createElement("li");
    let labelStopwatchName = createStopwatchNameLabel(text);
    let buttonStopwatchTime = createStopwatchButton(stopwatchIdIndex);
    let buttonRemoveStopwatch = createRemoveButton(stopwatchIdIndex);
    let buttonResetStopwatch = createRefreshButton(stopwatchIdIndex);

    listItem.id = `item-${stopwatchIdIndex}`;
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

  function createStopwatchButton(index) {
    let buttonStopwatchTime = document.createElement("button");
    buttonStopwatchTime.dataset.index = index;
    buttonStopwatchTime.id = `stopwatch-${index}`;
    buttonStopwatchTime.setAttribute("class", "time time-inactive mdl-button mdl-js-button mdl-button--raised mdl-button--accent");
    buttonStopwatchTime.innerHTML = timePlaceholder;

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

  function createStopwatch() {
    return {
      active : false,
      hours : 0,
      minutes: 0,
      seconds : 0,
      timer : null
    };
  }

  function addStopwatch(e){
    e.preventDefault();
    const taskInput = this.querySelector("[name=item]");
    const text = taskInput.value;
    const listItem = createStopwatchListItem(text);
    stopwatchesHTML.appendChild(listItem);
    stopwatches[stopwatchIdIndex] = createStopwatch();
    stopwatchIdIndex++;
    this.reset();
    taskInput.parentElement.classList.remove("is-focus", "is-dirty");
  }

  function deleteStopwatch(elementId) {
    clearInterval(stopwatches[elementId].timer);
    delete stopwatches[elementId];
    const item = document.getElementById(`item-${elementId}`);
    stopwatchesHTML.removeChild(item);
  }

  function resetStopwatch(elementId) {
    clearInterval(stopwatches[elementId].timer);
    stopwatches[elementId].seconds = 0;
    stopwatches[elementId].minutes = 0;
    stopwatches[elementId].hours = 0;
    let stopwatchButton = document.getElementById(`stopwatch-${elementId}`);
    stopwatchButton.innerHTML = timePlaceholder;
    stopwatchButton.classList.remove("mdl-button--colored");
    stopwatchButton.classList.add("mdl-button--accent");
  }

  stopwatchesHTML.addEventListener("click", toggleStopwatch);
  addStopwatches.addEventListener("submit", addStopwatch);
