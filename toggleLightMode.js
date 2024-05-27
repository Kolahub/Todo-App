export function toggleDarkLightMode() {
    /**
     * Utility function to calculate the current theme setting.
     * Look for a local storage value.
     * Fall back to system setting.
     * Fall back to light mode.
     */
    function calculateSettingAsThemeString({
      localStorageTheme,
      systemSettingDark,
    }) {
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
    let currentThemeSetting = calculateSettingAsThemeString({
      localStorageTheme,
      systemSettingDark,
    });
  
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