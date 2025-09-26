import Alpine from "alpinejs";

/**
 * @typedef {object} DarkModeStore
 * @property {boolean} dark - The current state of dark mode.
 * @property {() => void} init - Initializes the dark mode state from localStorage and system preference.
 * @property {() => void} toggle - Toggles dark mode on/off and persists the choice.
 */

/**
 * Sets up the Alpine.js store for dark mode management.
 * This store handles toggling the 'dark' class on the <html> element
 * and persists the user's choice in localStorage.
 */
export function setupDarkMode() {
  Alpine.store("darkMode", {
    /** @type {boolean} */
    dark: false,

    /**
     * Initializes the dark mode state.
     * It checks localStorage first, then falls back to the user's system preference.
     */
    init() {
      const storedPreference = localStorage.getItem("darkMode");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      this.dark =
        storedPreference !== null ? JSON.parse(storedPreference) : prefersDark;

      document.documentElement.classList.toggle("dark", this.dark);
    },

    /** Toggles the dark mode state, updates localStorage, and the <html> class. */
    toggle() {
      this.dark = !this.dark;
      localStorage.setItem("darkMode", this.dark);
      document.documentElement.classList.toggle("dark", this.dark);
    },
  });
}
