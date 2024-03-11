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


let itemsLeft = 0;
listLeft.textContent = localStorage.getItem('itemsLeft') ?  localStorage.getItem('itemsLeft') : 0
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
console.log(itemsArray)
document.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputData.value !== "") {
    itemsLeft++;
    localStorage.setItem('itemsLeft', JSON.stringify(itemsLeft))
    listLeft.textContent = localStorage.getItem('itemsLeft')
    const item = document.querySelector(".inputData")
    createItem(item)
    inputData.value = '';
  }
})
function clearAll () {
  if (itemsArray.length === 0) {
    localStorage.removeItem('items')
    localStorage.removeItem('itemsLeft')
  }
}
function displayItems(){
  let items = ""
  itemsArray.forEach(function (value, key) {
    items += `
    <div class="taskList d-flex flex-grow align-items-center p-3" draggable="true">
    <div class="check">
    </div>

      <p class="taskText d-block mb-0">
      ${itemsArray[key]}
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
  activeDragListeners() 
  activeTouchListeners() 


  if (taskBox.innerHTML !== '') {
    taskInfo.classList.add('bordertp')
  } else {
    taskInfo.classList.remove('bordertp')
  }
}

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

function activeDragListeners() {
  const taskLists = document.querySelectorAll('.taskList');
  taskLists.forEach(element => {
    element.addEventListener('dragstart',(event) => {
      console.log(event);
      taskBox.addEventListener('dragover', (event) => {
        event.preventDefault();
      });

      taskBox.addEventListener('drop',(event) => {
        taskBox.prepend(element);
      });
    });
  });
}

function activeTouchListeners() {
  const taskLists = document.querySelectorAll('.taskList');
  taskLists.forEach(element => {
    element.addEventListener('touchstart',(event) => {
      console.log(event);
      taskBox.addEventListener('touchleave', (event) => {
        event.preventDefault();
      });

      taskBox.addEventListener('touchenter',(event) => {
        taskBox.prepend(element);
      });
    });
  });
}

function activateDeleteListeners(){
  let deleteBtn = document.querySelectorAll(".removeTask")
  deleteBtn.forEach((dB, i) => {
    dB.addEventListener("click", () => { deleteItem(i) })
  })
}

function createItem(item){
  itemsArray.unshift(item.value)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  displayItems(); // Update the UI without reloading
}

function deleteItem(i){
  itemsLeft--;
  listLeft.textContent = `${itemsLeft}`;
  itemsArray.splice(i,1)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  localStorage.setItem('itemsLeft', JSON.stringify(itemsLeft))
  clearAll ()
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
  displayItems();
});


//CLEAR ALL THE TODO LISTS
document.querySelector('.uu').addEventListener('click',function () {
    itemsLeft = 0;
    listLeft.textContent = `${itemsLeft}`;
    taskBox.innerHTML = '';
    itemsArray = [];
    localStorage.setItem('items', JSON.stringify(itemsArray))
    localStorage.clear();
    taskInfo.classList.remove('bordertp')
  }) 

window.onload = function() {
  displayItems()
};
