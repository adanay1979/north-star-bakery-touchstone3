// North Star Bakery - Touchstone 4
// Interactive favorites, form validation, and browser storage

const bakeryItems = [
  { id: "sourdough", name: "Country Sourdough" },
  { id: "whole-grain", name: "Whole Grain Loaf" },
  { id: "signature", name: "Signature Loaf" },
  { id: "pastries", name: "Bakery Pastries" }
];

const storageKeys = {
  favorites: "northStarFavorites",
  customerName: "northStarCustomerName"
};

function getFavorites() {
  return JSON.parse(localStorage.getItem(storageKeys.favorites)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
}

function updateFavoritesDisplay() {
  const favorites = getFavorites();
  const display = document.querySelector("#favorites-display");

  if (!display) return;

  if (favorites.length === 0) {
    display.textContent = "You have not selected any favorites yet.";
    return;
  }

  const favoriteNames = favorites.map((id) => {
    const item = bakeryItems.find((product) => product.id === id);
    return item ? item.name : id;
  });

  display.textContent = `Saved favorites: ${favoriteNames.join(", ")}`;
}

function toggleFavorite(itemId) {
  let favorites = getFavorites();

  if (favorites.includes(itemId)) {
    favorites = favorites.filter((id) => id !== itemId);
  } else {
    favorites.push(itemId);
  }

  saveFavorites(favorites);
  updateFavoriteButtons();
  updateFavoritesDisplay();
}

function updateFavoriteButtons() {
  const favorites = getFavorites();

  document.querySelectorAll(".favorite-button").forEach((button) => {
    const itemId = button.dataset.item;

    if (favorites.includes(itemId)) {
      button.textContent = "★ Saved Favorite";
      button.setAttribute("aria-pressed", "true");
    } else {
      button.textContent = "☆ Add to Favorites";
      button.setAttribute("aria-pressed", "false");
    }
  });
}

function initializeFavorites() {
  document.querySelectorAll(".favorite-button").forEach((button) => {
    button.addEventListener("click", () => {
      toggleFavorite(button.dataset.item);
    });
  });

  updateFavoriteButtons();
  updateFavoritesDisplay();
}

function showError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);

  if (error) {
    error.textContent = message;
  }

  field.setAttribute("aria-invalid", "true");
}

function clearError(field) {
  const error = document.querySelector(`#${field.id}-error`);

  if (error) {
    error.textContent = "";
  }

  field.removeAttribute("aria-invalid");
}

function validateForm(event) {
 event.preventDefault();
  const form = event.currentTarget;
  const nameField = form.querySelector("#name");
  const emailField = form.querySelector("#email");

  let isValid = true;

  clearError(nameField);
  clearError(emailField);

  if (nameField.value.trim().length < 2) {
    showError(nameField, "Please enter at least 2 characters for your name.");
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(emailField.value.trim())) {
    showError(emailField, "Please enter a valid email address.");
    isValid = false;
  }

  if (!isValid) {
    event.preventDefault();
    return;
  }

  localStorage.setItem(
    storageKeys.customerName,
    nameField.value.trim()
  );
}

function restoreCustomerName() {
  const nameField = document.querySelector("#name");
  const savedName = localStorage.getItem(storageKeys.customerName);

  if (nameField && savedName) {
    nameField.value = savedName;
  }
}

function initializeForm() {
  const form = document.querySelector("#preorder-form");

  if (!form) return;

  restoreCustomerName();
  form.addEventListener("submit", validateForm);
}

document.addEventListener("DOMContentLoaded", () => {
  initializeFavorites();
  initializeForm();
});
