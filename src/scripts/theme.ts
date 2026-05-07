// Constants
const THEME = "theme";
const PALETTE = "palette";
const LIGHT = "light";
const DARK = "dark";
const DEFAULT_PALETTE = "raspberry";
const PALETTES = ["raspberry", "aubergine", "rosewood", "brick"] as const;
const THEME_PREVIEW = "themePreview";

type Palette = (typeof PALETTES)[number];

// Initial color scheme
// Can be "light", "dark", or empty string for system's prefers-color-scheme
const initialColorScheme = "";

function getPreferTheme(): string {
  // get theme data from local storage (user's explicit choice)
  const currentTheme = localStorage.getItem(THEME);
  if (currentTheme) return currentTheme;

  // return initial color scheme if it is set (site default)
  if (initialColorScheme) return initialColorScheme;

  // return user device's prefer color scheme (system fallback)
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

function isPalette(value: string | null): value is Palette {
  return PALETTES.includes(value as Palette);
}

function getPreferPalette(): Palette {
  const previewEnabled = isThemePreviewEnabled();
  if (!previewEnabled) return DEFAULT_PALETTE;

  const savedPalette = localStorage.getItem(PALETTE);
  if (isPalette(savedPalette)) return savedPalette;

  return DEFAULT_PALETTE;
}

function isThemePreviewEnabled(): boolean {
  return new URLSearchParams(window.location.search).get(THEME_PREVIEW) === "1";
}

// Use existing theme value from inline script if available, otherwise detect
let themeValue = window.theme?.themeValue ?? getPreferTheme();
let paletteValue = window.theme?.paletteValue ?? getPreferPalette();

function setPreference(): void {
  localStorage.setItem(THEME, themeValue);
  if (isThemePreviewEnabled()) {
    localStorage.setItem(PALETTE, paletteValue);
  } else {
    localStorage.removeItem(PALETTE);
  }
  reflectPreference();
}

function reflectPreference(): void {
  document.firstElementChild?.setAttribute("data-theme", themeValue);
  document.firstElementChild?.setAttribute("data-palette", paletteValue);

  document.querySelector("#theme-btn")?.setAttribute("aria-label", themeValue);

  const paletteSelect =
    document.querySelector<HTMLSelectElement>("#palette-select");
  const paletteSwitcher =
    document.querySelector<HTMLElement>("#palette-switcher");
  if (paletteSwitcher) {
    paletteSwitcher.classList.toggle("hidden", !isThemePreviewEnabled());
    paletteSwitcher.classList.toggle("flex", isThemePreviewEnabled());
  }
  if (paletteSelect) {
    paletteSelect.value = paletteValue;
  }

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

// Update the global theme API
if (window.theme) {
  window.theme.setPreference = setPreference;
  window.theme.reflectPreference = reflectPreference;
} else {
  window.theme = {
    themeValue,
    paletteValue,
    setPreference,
    reflectPreference,
    getTheme: () => themeValue,
    setTheme: (val: string) => {
      themeValue = val;
    },
    getPalette: () => paletteValue,
    setPalette: (val: string) => {
      if (isPalette(val)) paletteValue = val;
    },
  };
}

// Ensure theme is reflected (in case body wasn't ready when inline script ran)
reflectPreference();

function setThemeFeature(): void {
  // set on load so screen readers can get the latest value on the button
  reflectPreference();

  // now this script can find and listen for clicks on the control
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    themeValue = themeValue === LIGHT ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    setPreference();
  });

  const paletteSelect =
    document.querySelector<HTMLSelectElement>("#palette-select");
  if (paletteSelect) {
    paletteSelect.value = paletteValue;
    paletteSelect.onchange = () => {
      if (!isPalette(paletteSelect.value)) return;
      paletteValue = paletteSelect.value;
      window.theme?.setPalette(paletteValue);
      setPreference();
    };
  }
}

// Set up theme features after page load
setThemeFeature();

// Runs on view transitions navigation
document.addEventListener("astro:after-swap", setThemeFeature);

// Set theme-color value before page transition
// to avoid navigation bar color flickering in Android dark mode
document.addEventListener("astro:before-swap", (event) => {
  const astroEvent = event;
  const bgColor = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");

  if (bgColor) {
    astroEvent.newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
});

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? DARK : LIGHT;
    window.theme?.setTheme(themeValue);
    setPreference();
  });
