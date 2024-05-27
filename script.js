import { toggleDarkLightMode } from "./toggleLightMode.js";

class Todo {
  #inputData = document.querySelector(".inputData");
  #taskBox = document.querySelector(".taskBox");
  #listLeft = document.querySelector(".listLeft");
  #clearBtn = document.querySelector(".clear");
  #taskInfo = document.querySelector(".taskInfo");
  #clearAllBtn = document.querySelectorAll(".clear--all")

  #itemsLeft = localStorage.getItem("itemsLeft")
    ? localStorage.getItem("itemsLeft")
    : 0;

  // check if there is key items in available in the local Storage, if not them the itemsArray gets an empty Array
  #itemsArray = localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];

  constructor() {
    this._sortable();
    this._displayItems();
    this._clearAllCompletedTasks();
    this._addTaskToTaskList();
    this._clearAllTasks();
    this._showItemsLeft();
  }

  _showItemsLeft() {
    // check if there is itemsLeft key in available in the local Storage, if not then the listLeft.textContent equal 0
    this.#listLeft.textContent = localStorage.getItem("itemsLeft")
      ? localStorage.getItem("itemsLeft")
      : 0;
  }

  _showDragContent() {
    if (this.#itemsArray.length >= 2) {
      document.querySelector(".drag").classList.remove("hidden");
    } else {
      document.querySelector(".drag").classList.add("hidden");
    }
  }

  _clearAll() {
    if (this.#itemsArray.length === 0) {
      localStorage.removeItem("items");
      localStorage.removeItem("itemsLeft");
    }
  }

  _displayItems() {
    let items = "";
    this.#itemsArray.forEach(function (value, i) {
      items += `
    <div class="taskList d-flex flex-grow align-items-center p-3" draggable="true">
    <div class="check ${value.completed === true ? "checked" : undefined}">
    </div>

      <p class="taskText d-block mb-0 ${
        value.completed === true ? "taskText--checked" : undefined
      }">
      ${value.value}
      </p>

    <div class="removeTask">
      <img src="images/icon-cross.svg" alt="" class="removeTaskPic">
    </div>
  </div>
    `;
    });

    this.#taskBox.innerHTML = items;
    this._activateDeleteListeners();
    this._activateCheckListeners();

    if (this.#taskBox.innerHTML !== "") {
      this.#taskInfo.classList.add("bordertp");
    } else {
      this.#taskInfo.classList.remove("bordertp");
    }
  }

  //CHECKS AND UNCHECKS COMPLETEED TASK
  _activateCheckListeners() {
    const checkBoxes = document.querySelectorAll(".check");
    checkBoxes.forEach((checkBox) => {
      checkBox.addEventListener("click", (e) => {
        const task = e.target
          .closest(".taskList")
          .querySelector(".taskText").textContent;
        let obj = this.#itemsArray.find((el) => el.value === task.trim());

        checkBox.classList.toggle("checked");
        if (checkBox.classList.contains("checked")) {
          this.#itemsLeft--;
          const taskText = checkBox.nextElementSibling;
          taskText.classList.add("taskText--checked");
          obj.completed = true;
        } else {
          this.#itemsLeft++;
          const taskText = checkBox.nextElementSibling;
          taskText.classList.remove("taskText--checked");
          obj.completed = false;
        }

        //UPDATE ITEM LEFT VALUE IN DOM AND LOCAL STORAGE
        this.#listLeft.textContent = `${this.#itemsLeft}`;
        localStorage.setItem("itemsLeft", JSON.stringify(this.#itemsLeft));
        localStorage.setItem("items", JSON.stringify(this.#itemsArray));
        console.log(obj, this.#itemsArray);
      });
    });
  }

  //DELETES EACH TASKS
  _activateDeleteListeners() {
    let deleteBtn = document.querySelectorAll(".removeTask");
    deleteBtn.forEach((dB, i) => {
      dB.addEventListener("click", () => {
        this._deleteItem(i);
      });
    });
  }

  //ADDS NEW TASK TO YOUR TODO LISTS
  _createItem(item) {
    this.#itemsArray.unshift({ value: item.value, completed: false });
    localStorage.setItem("items", JSON.stringify(this.#itemsArray));
    this._displayItems(); // Update the UI without reloading
  }

  //_activateCheckListeners IS DEPENDANT ON THIS FUNCTION TO DELETE TASKS FROM TODO LISTS
  _deleteItem(i) {
    this.#itemsLeft--;
    this.#listLeft.textContent = `${this.#itemsLeft}`;
    this.#itemsArray.splice(i, 1);
    localStorage.setItem("items", JSON.stringify(this.#itemsArray));
    localStorage.setItem("itemsLeft", JSON.stringify(this.#itemsLeft));
    this._update();
  }

  _update() {
    this._clearAll();
    this._showDragContent();
    this._displayItems(); // Update the UI without reloading
  }

  //CLEARS ALL COMPLETED TASKS FROM YOUR TODO LISTS
  _clearAllCompletedTasks() {
    // Clears All the Completed Todo Lists
    this.#clearBtn.addEventListener("click", () => {
      const checkedTasks = document.querySelectorAll(".taskText--checked");
      checkedTasks.forEach((task) => {
        const taskElement = task.closest(".taskList");
        const taskIndex = this.#itemsArray.findIndex(
          (el) => el.value === task.textContent.trim()
        );
        // const taskIndex = this.#itemsArray.indexOf(task.textContent.trim());
        if (taskIndex > -1) {
          this.#itemsArray.splice(taskIndex, 1);
        }

        localStorage.setItem("items", JSON.stringify(this.#itemsArray));
        taskElement.remove();
      });

      this._update();
    });
  }

  //CLEARS ALL TASK FROM YOUR TODO LISTS
  _clearAllTasks() {
    //CLEAR ALL THE TODO LISTS
    this.#clearAllBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.#itemsLeft = 0;
        this.#listLeft.textContent = `${this.#itemsLeft}`;
        this.#taskBox.innerHTML = "";
        this.#itemsArray = [];
        localStorage.removeItem("items");
        localStorage.removeItem("itemsLeft");
        if (this.#itemsArray.length >= 2) {
          document.querySelector(".drag").classList.remove("hidden");
        } else {
          document.querySelector(".drag").classList.add("hidden");
        }
        this.#taskInfo.classList.remove("bordertp");
      });
    });
  }

  _sortable() {
    //Enables Drag and Drop to Reorder Todo lists Using the Sortable.js library
    document.addEventListener("DOMContentLoaded", () => {
      // Initialize Sortable
      new Sortable(this.#taskBox, {
        animation: 150, // Animation duration in milliseconds (optional)
        swap: true, // Enable the swap feature
        onEnd: function (evt) {
          // Callback function called when the user stopped sorting and the DOM has been updated
          console.log("Element was moved:", evt.item);
        },
      });
    });
  }

  _addTaskToTaskList() {
    //Add a Task Functiuonality
    document.addEventListener("keyup", (e) => {
      if (e.key === "Enter" && this.#inputData.value !== "") {
        this.#itemsLeft++;
        localStorage.setItem("itemsLeft", JSON.stringify(this.#itemsLeft));
        this.#listLeft.textContent = localStorage.getItem("itemsLeft");
        const item = document.querySelector(".inputData");
        this._createItem(item);
        this.#inputData.value = "";
        this._showDragContent();
      }
    });
  }
}

window.onload = () => {
new Todo();
toggleDarkLightMode()
}
