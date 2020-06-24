class SugarCheck {
  constructor(date, sugarLevel, feeling) {
    this.date = date;
    this.sugarLevel = sugarLevel;
    this.feeling = feeling;
  }
}

class UI {
  static displaySugarCheck() {
    const sugarLevels = Store.getRecord();

    sugarLevels.forEach((measurement) => UI.addSugarLevelToList(measurement));
  }
  static addSugarLevelToList(measurement) {
    const list = document.querySelector("#sugar-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${measurement.date}</td>
        <td>${measurement.sugarLevel}</td>
        <td>${measurement.feeling}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
    list.appendChild(row);
  }

//
  
  static addSugarLevelToListAlert(measurement) {
    const list = document.querySelector("#sugar-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${measurement.date}</td>
        <td>${measurement.sugarLevel}</td>
        <td>${measurement.feeling}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
    //
    row.style["background-color"] = "red";
    //
    list.appendChild(row);
  }

//
  
  static deleteSugarLevelFromList(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#sugar-form");
    container.insertBefore(div, form);
    //disappear in 2sec
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#date").value = "";
    document.querySelector("#sugar-level").value = "";
    document.querySelector("#feeling").value = "";
  }
}

// Local Storage
class Store {
  static getRecord() {
    let sugarLevels;
    if (localStorage.getItem("sugarLevels") === null) {
      sugarLevels = [];
    } else {
      sugarLevels = JSON.parse(localStorage.getItem("sugarLevels"));
    }
    return sugarLevels;
  }

  static addRecord(measurement) {
    const sugarLevels = Store.getRecord();
    sugarLevels.push(measurement);
    localStorage.setItem("sugarLevels", JSON.stringify(sugarLevels));
  }

  static removeRecord(date) {
    const sugarLevels = Store.getRecord();

    sugarLevels.forEach((measurement, index) => {
      if (measurement.date === date) {
        sugarLevels.splice(index, 1);
      }
    });

    localStorage.setItem("sugarLevels", JSON.stringify(sugarLevels));
  }
}

document.addEventListener("DOMContentLoaded", UI.displaySugarCheck);

//adding a sugar measurment
document.querySelector("#sugar-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const date = document.querySelector("#date").value;
  const sugarLevel = document.querySelector("#sugar-level").value;
  const feeling = document.querySelector("#feeling").value;

  //become sure that the fields are filled
  if (date === "" || sugarLevel === "" || feeling === "") {
    UI.showAlert("You should fill in all the fields!", "danger");
    // reacts to increased blood sugar
  } else if (sugarLevel > 5.5) {
    
    UI.showAlert("Your blood sugar level is above average! You should contact your doctor immediately!", "danger");
    const sugarLevelMeasured = new SugarCheck(date, sugarLevel, feeling);
    
        UI.addSugarLevelToListAlert(sugarLevelMeasured);

        Store.addRecord(sugarLevelMeasured);

        UI.clearFields();
  } else if (sugarLevel < 3.3) {
    
    UI.showAlert("Your blood sugar level is beyond average! You should contact your doctor immediately!", "danger");
    const sugarLevelMeasured = new SugarCheck(date, sugarLevel, feeling);
    
        UI.addSugarLevelToListAlert(sugarLevelMeasured);

        Store.addRecord(sugarLevelMeasured);

        UI.clearFields();
  } else {
    sugarLevelMeasured = new SugarCheck(date, sugarLevel, feeling);

    UI.addSugarLevelToList(sugarLevelMeasured);

    Store.addRecord(sugarLevelMeasured);

    UI.showAlert("Record Added", "success");

    UI.clearFields();
  }
});

//deleting a measurment
document.querySelector("#sugar-list").addEventListener("click", (e) => {
  
  UI.deleteSugarLevelFromList(e.target);

  // removing book from local storage
  Store.removeRecord(
    e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent
  );
  
  UI.showAlert("Record Removed", "success");
});
