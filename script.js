function toggleDarkLightMode () {
/**
* Utility function to calculate the current theme setting.
* Look for a local storage value.
* Fall back to system setting.
* Fall back to light mode.
*/
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

/**
* Utility function to update the button text and aria-label.
*/
/**
 * Updates the button element with a new image based on the current theme.
 * It also sets the `aria-label` attribute of the button to the new image.
 * 
 * @param {Object} options - The options object.
 * @param {HTMLElement} options.buttonEl - The button element to be updated.
 * @param {boolean} options.isDark - A flag indicating whether the current theme is dark or not.
 */
function updateButton({ buttonEl, isDark }) {
  const lightThemeLogo = createImage("images/icon-sun.svg");
  const darkThemeLogo = createImage("images/icon-moon.svg");
  const newCta = isDark ? lightThemeLogo : darkThemeLogo;

  setAriaLabel(buttonEl, newCta);
  setButtonContent(buttonEl, newCta);
}

/**
 * Creates an image element with the specified source.
 * 
 * @param {string} src - The source URL of the image.
 * @returns {HTMLImageElement} - The created image element.
 */
function createImage(src) {
  const img = document.createElement("img");
  img.src = src;
  return img;
}

/**
 * Sets the `aria-label` attribute of the specified element to the specified image.
 * 
 * @param {HTMLElement} element - The element to set the `aria-label` attribute for.
 * @param {HTMLImageElement} image - The image element to use for the `aria-label`.
 */
function setAriaLabel(element, image) {
  element.setAttribute("aria-label", image.src);
}

/**
 * Sets the innerHTML of the specified element to the specified content.
 * 
 * @param {HTMLElement} element - The element to set the innerHTML for.
 * @param {string} content - The content to set as innerHTML.
 */
function setButtonContent(element, content) {
  element.innerHTML = content.outerHTML;
}

/**
* Utility function to update the theme setting on the html tag
*/
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}


/**
* On page load:
*/

/**
* 1. Grab what we need from the DOM and system settings on page load
*/
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
* 2. Work out the current site settings
*/
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

/**
* 3. Update the theme setting and button text accoridng to current settings
*/
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
* 4. Add an event listener to toggle the theme
*/
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });

  currentThemeSetting = newTheme;
}); 
}
toggleDarkLightMode()

const inputData = document.querySelector(".inputData");
let taskBox = document.querySelector(".taskBox");
const listLeft = document.querySelector('.listLeft');
const clearBtn = document.querySelector(".clear");
const taskInfo = document.querySelector('.taskInfo');

let itemsLeft;
// check if there is itemsLeft key in available in the local Storage, if not then the itemsLeft equal 0
itemsLeft = localStorage.getItem('itemsLeft') ?  localStorage.getItem('itemsLeft') : 0
// check if there is itemsLeft key in available in the local Storage, if not then the listLeft.textContent equal 0
listLeft.textContent = localStorage.getItem('itemsLeft') ?  localStorage.getItem('itemsLeft') : 0
// check if there is key items in available in the local Storage, if not them the itemsArray gets an empty Array 
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

//Add a Task Functiuonality
document.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputData.value !== "") {
    itemsLeft++;
    localStorage.setItem('itemsLeft', JSON.stringify(itemsLeft))
    listLeft.textContent = localStorage.getItem('itemsLeft')
    const item = document.querySelector(".inputData")
    createItem(item)
    inputData.value = '';
    showDragContent () 
  }
})

//This Function will show the .drag content if the itemsArray is > 1
function showDragContent () {
  if (itemsArray.length >= 2) {
    document.querySelector('.drag').classList.remove('hidden')
  } else {
    document.querySelector('.drag').classList.add('hidden')
  }
}

//This function will remove the items and itemsLeft ITEM from the LOCAL STORAGE
function clearAll () {
  if (itemsArray.length === 0) {
    localStorage.removeItem('items')
    localStorage.removeItem('itemsLeft')
  }
}

//This function will add
function displayItems() {
  let items = ""
  itemsArray.forEach(function (value) {
    items += `
    <div class="taskList d-flex flex-grow align-items-center p-3" draggable="true">
    <div class="check">
    </div>

      <p class="taskText d-block mb-0">
      ${value}
      </p>

    <div class="removeTask">
      <img src="images/icon-cross.svg" alt="" class="removeTaskPic">
    </div>
  </div>
    `;
  })

  taskBox.innerHTML = items
  activateDeleteListeners()
  activateCheckListeners()

  if (taskBox.innerHTML !== '') {
    taskInfo.classList.add('bordertp')
  } else {
    taskInfo.classList.remove('bordertp')
  }
}

//This function add the checked styles to the list that is checked, also it updates the number of the itemsLefts
function activateCheckListeners(){
const checkBoxes = document.querySelectorAll('.check');
checkBoxes.forEach( function (checkBox) {
  checkBox.addEventListener('click', function () {
    checkBox.classList.toggle('checked')
    if (checkBox.classList.contains("checked")) {
      itemsLeft--;
      localStorage.setItem('itemsLeft', JSON.stringify(itemsLeft))
      listLeft.textContent = localStorage.getItem('itemsLeft')
      const taskText = checkBox.nextElementSibling;
      taskText.classList.add('taskText--checked');
    } else {
      itemsLeft++;
      localStorage.setItem('itemsLeft', JSON.stringify(itemsLeft))
      listLeft.textContent = localStorage.getItem('itemsLeft')
      const taskText = checkBox.nextElementSibling;
      taskText.classList.remove('taskText--checked');
    }
  })
})
}

//Enables Drag and Drop to Reorder Todo lists Using the Sortable.js library
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Sortable
  new Sortable(taskBox, {
    animation: 150, // Animation duration in milliseconds (optional)
    swap: true, // Enable the swap feature
    onEnd: function (evt) {
      // Callback function called when the user stopped sorting and the DOM has been updated
      console.log('Element was moved:', evt.item);
    }
  });
});

//This Function delete and task from the todo lists
function activateDeleteListeners(){
  let deleteBtn = document.querySelectorAll(".removeTask")
  deleteBtn.forEach((dB, i) => {
    dB.addEventListener("click", () => { deleteItem(i) })
  })
}

//Function create and displays a new task lisk
function createItem(item){
  itemsArray.unshift(item.value)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  displayItems(); // Update the UI without reloading
}

// The activateDeleteListeners Function is dependent on this to remove/delete a function from the lists
function deleteItem(i){
  itemsLeft--;
  listLeft.textContent = `${itemsLeft}`;
  itemsArray.splice(i,1)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  localStorage.setItem('itemsLeft', JSON.stringify(itemsLeft))
  clearAll ()
  showDragContent () 
  displayItems(); // Update the UI without reloading
}

// Clears All the Completed Todo Lists
clearBtn.addEventListener("click", function () {
  const checkedTasks = document.querySelectorAll(".taskText--checked");
  checkedTasks.forEach(function (task, i) {
    const taskIndex = i;
    console.log(taskIndex)
    itemsArray.splice(taskIndex, checkedTasks.length);
    localStorage.setItem("items", JSON.stringify(itemsArray));
    task.parentNode.remove();
  });
  clearAll ()
  showDragContent () 
  displayItems();
});


//CLEAR ALL THE TODO LISTS
document.querySelectorAll('.clear--all').forEach(btn => {
  btn.addEventListener('click',function () {
    itemsLeft = 0;
    listLeft.textContent = `${itemsLeft}`;
    taskBox.innerHTML = '';
    itemsArray = [];
    localStorage.setItem('items', JSON.stringify(itemsArray))
    localStorage.removeItem('items')
    localStorage.removeItem('itemsLeft')
    if (itemsArray.length >= 2) {
      document.querySelector('.drag').classList.remove('hidden')
    } else {
      document.querySelector('.drag').classList.add('hidden')
    }
    taskInfo.classList.remove('bordertp')
  }) 
})

window.onload = function() {
  displayItems()
};