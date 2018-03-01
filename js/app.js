// Storage Controller
const StorageCtrl = (function() {
  // Public
  return {
    addMealToStorage: function(meal) {
      let meals;
      if (localStorage.getItem('meals')) {
        meals = JSON.parse(localStorage.getItem('meals'));
      } else {
        meals = [];
      }
      meals.push(meal);
      localStorage.setItem('meals', JSON.stringify(meals));
    },
    getMealsFromStorage: function() {
      let meals;
      if (localStorage.getItem('meals')) {
        meals = JSON.parse(localStorage.getItem('meals'));
      } else {
        meals = [];
      }
      return meals;
    },
    addMealToDayStorage: function(meal, day) {
      let dayStorage;
      if (localStorage.getItem(day)) {
        dayStorage = JSON.parse(localStorage.getItem(day));
      } else {
        dayStorage = [];
      }
      // Create ID
      let id;
      if (dayStorage.length > 0) {
        id = dayStorage[dayStorage.length - 1].id + 1;
      } else {
        id = 0;
      }
      newMeal = {
        id,
        meal
      }
      dayStorage.push(newMeal);
      localStorage.setItem(day, JSON.stringify(dayStorage));
    },
    getDayFromStorage: function(day) {
      let dayStorage;
      if (localStorage.getItem(day)) {
        dayStorage = JSON.parse(localStorage.getItem(day));
      } else {
        dayStorage = [];
      }
      return dayStorage;
    },
    removeMealFromDay: function(id, day, dayData) {
      dayData.forEach((item, index) => {
        if (id === `meal-${item.id}`) {
          dayData.splice(index, 1);
        }
      });
      localStorage.setItem(day, JSON.stringify(dayData));
    }
  };
})();

// Ingredient Controller
const IngredientCtrl = (function(){
  // Ingredient constructor
  const Ingredient = function(id, name, calories, protein) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    this.protein = protein;
  };

  const data = {
    ingredients: [],
    currentMeal: null,
    totalCalories: 0,
    totalProtein: 0
  };
  
  // Public
  return {
    createIngredient: function(name, calories, protein) {
      // Create ID
      let id;
      if (data.ingredients.length > 0) {
        id = data.ingredients[data.ingredients.length - 1].id + 1;
      } else {
        id = 0;
      }
      // Convert to number
      calories = parseInt(calories);
      protein = parseInt(protein);
      // Create ingredient
      const newIngredient = new Ingredient(id, name, calories, protein);
      // Add to array
      data.ingredients.push(newIngredient);

      return newIngredient;
    },
    removeIngredient: function(itemID) {
      data.ingredients.forEach((ingredient, index) => {
        if (itemID === `ingredient-${ingredient.id}`) {
          data.ingredients.splice(index, 1);
        }
      });
      
    },
    getIngredientData: function() {
      return data;
    },
    getIngredientTotals: function() {
      let calories = 0;
      let protein = 0;
      data.ingredients.forEach(ingredient => {
        calories += ingredient.calories;
        protein += ingredient.protein;
      });
      data.totalCalories = calories;
      data.totalProtein = protein;
      return {
        calories,
        protein
      };
    },
    clearData: function() {
      data.ingredients = [];
    },
    logData: function() {
      return data;
    }
  };
})();

// Meal Controller
const MealCtrl = (function() {
  // Meal constructor
  const Meal = function(id, name, ingredients, calories, protein) {
    this.id = id;
    this.name = name;
    this.ingredients = ingredients;
    this.calories = calories;
    this.protein = protein;
  };

  const data = {
    day: '',
    meals: [],
    totalCalories: 0,
    totalProtein: 0
  };

  // Public
  return {
    createMeal: function(meals, name, data) {
      // Create ID
      let id;
      if (meals.length > 0) {
        id = meals[meals.length - 1].id + 1;
      } else {
        id = 0;
      }
      const ingredients = data.ingredients;
      const calories = data.totalCalories;
      const protein = data.totalProtein;
      const newMeal = new Meal(id, name, ingredients, calories, protein);

      return newMeal;
    },
    getMealTotals: function(dayData) {
      let calories = 0;
      let protein = 0;
      dayData.forEach(item => {
        calories += item.meal.calories;
        protein += item.meal.protein;
      });
      return {
        calories,
        protein
      };
    },
    loadSelectedDay: function(day, dayData, totals) {
      data.day = day;
      let meals = dayData;
      data.totalCalories = totals.calories;
      data.totalProtein = totals.protein;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  // Selectors
  const UISelectors = {
    ingredientList: '.meal-view__list',
    ingredientListItems: '.meal-view__item',
    mealGrid: '.day-view__meals',
    mealGridItems: '.day-view__meal',
    addIngredientBtn: '.add-ingredient-btn',
    addMealBtn: '.add-meal-btn',
    infoBtn: '.btn--view',
    ingredientNameInput: '#ingredient-name',
    ingredientCaloriesInput: '#ingredient-calories',
    ingredientProteinInput: '#ingredient-protein',
    mealNameInput: '#meal-name',
    totalMealCalories: '.total-meal-calories',
    totalMealProtein: '.total-meal-protein',
    totalDayCalories: '.total-day-calories',
    totalDayProtein: '.total-day-protein',
    currentDay: '.header__day',
    navLinks: '.side-nav__link',
    welcomeView: '.welcome',
    mealView: '.meal-view',
    dayView: '.day-view',
    dayHeading: '.day-heading',
    dayLead: '.day-lead',
    mealDropdown: '#add-meal-drop',
    addToDayBtn: '#add-meal-day',
    calendarIcon: '.feature--view',
    mealIcon: '.feature--create'
  };

  // Public
  return {
    getSelectors: function() {
      return UISelectors;
    },
    getIngredientInput: function() {
      const name = document.querySelector(UISelectors.ingredientNameInput).value;
      const calories = document.querySelector(UISelectors.ingredientCaloriesInput).value;
      const protein = document.querySelector(UISelectors.ingredientProteinInput).value;
      return {
        name,
        calories,
        protein
      };
    },
    getMealInput: function() {
      return document.querySelector(UISelectors.mealNameInput).value;
    },
    addIngredientToUI: function(ingredient) {
      const ul = document.querySelector(UISelectors.ingredientList);
      const li = document.createElement('li');
      li.className = 'meal-view__item';
      li.id = `ingredient-${ingredient.id}`;
      li.innerHTML = `
        <span class="meal-view__item-name">${ingredient.name}</span>
        <span class="meal-view__item-calories">${ingredient.calories} calories</span>
        <span class="meal-view__item-protein">${ingredient.protein}g protein</span>
        <a href="#" class="meal-view__delete">
          <svg class="meal-view__delete-icon delete-ingredient-svg">
            <use xlink:href="img/sprite.svg#icon-close" class="delete-ingredient-use"></use>
          </svg>
        </a>
      `;
      ul.appendChild(li);
    },
    removeIngredientFromUI: function(itemID) {
      const ingredients = document.querySelectorAll(UISelectors.ingredientListItems);
      ingredients.forEach(ingredient => {
        if (itemID === `${ingredient.id}`) {
          ingredient.remove();
        } 
      });
    },
    clearIngredientFields: function() {
      document.querySelector(UISelectors.ingredientNameInput).value = '';
      document.querySelector(UISelectors.ingredientCaloriesInput).value = '';
      document.querySelector(UISelectors.ingredientProteinInput).value = '';
    },
    displayCurrentDay: function() {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayIndex = new Date().getDay();
      const today = days[dayIndex];
      document.querySelector(UISelectors.currentDay).textContent = today;
    },
    displayIngredientTotals: function(totals) {
      document.querySelector(UISelectors.totalMealCalories).textContent = totals.calories;
      document.querySelector(UISelectors.totalMealProtein).textContent = `${totals.protein}g`;
    },
    displayMealView: function() {
      document.querySelector(UISelectors.welcomeView).style.display = 'none';
      document.querySelector(UISelectors.mealView).style.display = 'block';
      document.querySelector(UISelectors.dayView).style.display = 'none';
    },
    displayDayView: function(day, meals) {
      // Show day page
      document.querySelector(UISelectors.welcomeView).style.display = 'none';
      document.querySelector(UISelectors.mealView).style.display = 'none';
      document.querySelector(UISelectors.dayView).style.display = 'block';
      // Style page
      document.querySelector(UISelectors.dayHeading).textContent = day;
      document.querySelector(UISelectors.dayLead).textContent = `View and edit your meal schedule for ${day}`;
      // Add meals to dropdown list
      let html;
      meals.forEach(meal => {
        html += `<option value="meal-${meal.id}">${meal.name}</option>`;
      });
      document.querySelector(UISelectors.mealDropdown).innerHTML = html;
    },
    setActiveLink: function(target) {
      document.querySelectorAll(UISelectors.navLinks).forEach(link => {
        if (target === link) {
          link.className += '  side-nav__link--active';
        } else {
          link.className = 'side-nav__link';
        }
      });
    },
    clearMealFields: function() {
      document.querySelectorAll(UISelectors.ingredientListItems).forEach(item => {
        item.remove();
      });
      document.querySelector(UISelectors.mealNameInput).value = '';
      document.querySelector(UISelectors.mealNameInput).placeholder = 'Meal Created!';
    },
    getMealID: function() {
      const id = document.querySelector(UISelectors.mealDropdown).value;
      return id;
    },
    getDayFromPage: function() {
      const day = document.querySelector(UISelectors.dayHeading).textContent;
      return day;
    },
    displayMeals: function(dayData) {
      let html = '';
      dayData.forEach(item => {
        html += `
        <div class="day-view__meal" id="meal-${item.id}">
          <a href="#" class="day-view__delete">
            <svg class="day-view__delete-icon delete-meal-svg">
              <use xlink:href="img/sprite.svg#icon-close" class="delete-meal-use"></use>
            </svg>
          </a>
          <svg class="day-view__meal-icon">
            <use xlink:href="img/sprite.svg#icon-spoon-knife"></use>
          </svg>
          <div class="day-view__meal-name">
            ${item.meal.name}
          </div>
          <div class="day-view__meal-calories">
            ${item.meal.calories} calories
          </div>
          <div class="day-view__meal-protein">
            ${item.meal.protein}g protein
          </div>
          <button class="btn btn--view">More info &rarr;</button>
        </div>
        `;
      });
      document.querySelector(UISelectors.mealGrid).innerHTML = html;
    },
    displayMealTotals: function(totals) {
      document.querySelector(UISelectors.totalDayCalories).textContent = `${totals.calories}`;
      document.querySelector(UISelectors.totalDayProtein).textContent = `${totals.protein}g`
    },
    removeMealFromUI: function(id) {
      document.querySelectorAll(UISelectors.mealGridItems).forEach(item => {
        if (item.id === id) {
          item.remove();
        }
      });
    },
    showMealInfoUI: function(id, dayData, btn) {
      let html = '';
      dayData.forEach(item => {
        if (id === `meal-${item.id}`) {
          item.meal.ingredients.forEach(ingredient => {
            if (html === '') {
              html += `<strong>Ingredients:</strong> ${ingredient.name} <em>(${ingredient.calories} calories, ${ingredient.protein}g protein)</em>`;
            } else {
              html += `, ${ingredient.name} <em>(${ingredient.calories} calories, ${ingredient.protein}g protein)</em>`;
            }
          });
        }
      });
      const div = document.createElement('div');
      div.className = 'more-info';
      div.style.marginTop = '1rem';
      div.innerHTML = html;
      document.getElementById(id).appendChild(div); 
      btn.remove();
    }
  };
})();

// App Controller
const App = (function(IngredientCtrl, MealCtrl, UICtrl, StorageCtrl) {
  const UISelectors = UICtrl.getSelectors();
  // Event listeners
  const loadEventListeners = function() {
    // Add ingredient event
    document.querySelector(UISelectors.addIngredientBtn).addEventListener('click', addIngredient);
    // Remove ingredient event
    document.querySelector(UISelectors.ingredientList).addEventListener('click', removeIngredient);
    // Create meal event
    document.querySelector(UISelectors.addMealBtn).addEventListener('click', addMeal);
    // Navigation click event
    document.querySelectorAll(UISelectors.navLinks).forEach(link => {
      link.addEventListener('click', navClickHandler);
    });
    // Add meal to day event
    document.querySelector(UISelectors.addToDayBtn).addEventListener('click', addMealToDay);
    // Remove meal from day event
    document.querySelector(UISelectors.mealGrid).addEventListener('click', removeMeal);
    // More info click event
    document.querySelector(UISelectors.mealGrid).addEventListener('click', showMealInfo);
    // Welcome page - view meals event
    document.querySelector(UISelectors.calendarIcon).addEventListener('click', showToday);
    // Welcome page - create meal event
    document.querySelector(UISelectors.mealIcon).addEventListener('click', welcomeCreateMeal);
  };
  // Add ingredient function
  const addIngredient = function(e) {
    // Get input values
    const input = UICtrl.getIngredientInput();
    // Validate
    if (input.name !== '' && input.calories !== '' && input.protein !== '') {
      const ingredient = IngredientCtrl.createIngredient(input.name, input.calories, input.protein);
      UICtrl.addIngredientToUI(ingredient);
      UICtrl.clearIngredientFields();
    }
    // Update totals
    const totals = IngredientCtrl.getIngredientTotals();
    UICtrl.displayIngredientTotals(totals);

    e.preventDefault();
  };
  // Remove ingredient function
  const removeIngredient = function(e) {
    // Get id of list item
    let id;
    if (e.target.classList.contains('delete-ingredient-svg')) {
      id = e.target.parentElement.parentElement.id;
    } else if (e.target.classList.contains('delete-ingredient-use')) {
      id = e.target.parentElement.parentElement.parentElement.id;
    }
    // Remove ingredient from UI and data structure
    UICtrl.removeIngredientFromUI(id);
    IngredientCtrl.removeIngredient(id);
    // Update totals
    const totals = IngredientCtrl.getIngredientTotals();
    UICtrl.displayIngredientTotals(totals);
    
    e.preventDefault();
  };
  // Add meal function
  const addMeal = function(e) {
    // Get meal name
    const name = UICtrl.getMealInput();
    // Validate
    if (name !== '') {
      const meals = StorageCtrl.getMealsFromStorage();
      const ingredientData = IngredientCtrl.getIngredientData();
      const meal = MealCtrl.createMeal(meals, name, ingredientData);
      StorageCtrl.addMealToStorage(meal);
      UICtrl.clearMealFields();
      IngredientCtrl.clearData();
      // Update totals
      const totals = IngredientCtrl.getIngredientTotals();
      UICtrl.displayIngredientTotals(totals);
    }
    
    e.preventDefault();
  };
  // Navigation click handler
  const navClickHandler = function(e) {
    if (e.target.textContent === 'Create Meal') {
      UICtrl.displayMealView();
    } else {
      const day = e.target.textContent;
      loadDayView(day);
    }
    UICtrl.setActiveLink(e.target);

    e.preventDefault();
  };
  // Load day view
  const loadDayView = function(day) {
    const meals = StorageCtrl.getMealsFromStorage();
    const dayData = StorageCtrl.getDayFromStorage(day);
    const totals = MealCtrl.getMealTotals(dayData);
    UICtrl.displayDayView(day, meals);
    MealCtrl.loadSelectedDay(day, dayData, totals);
    UICtrl.displayMeals(dayData);
    UICtrl.displayMealTotals(totals);
  };
  // Add meal to day
  const addMealToDay = function(e) {
    const id = UICtrl.getMealID();
    const day = UICtrl.getDayFromPage();
    const meals = StorageCtrl.getMealsFromStorage();
    let currentMeal;
    meals.forEach(meal => {
      if (id === `meal-${meal.id}`) {
        currentMeal = meal; 
      }
    });
    StorageCtrl.addMealToDayStorage(currentMeal, day);
    loadDayView(day);
    e.preventDefault();
  };
  // Remove meal function
  const removeMeal = function(e) {
    if (e.target.classList.contains('delete-meal-svg') || e.target.classList.contains('delete-meal-use')) {
      // Get id of grid item
      let id;
      if (e.target.classList.contains('delete-meal-svg')) {
        id = e.target.parentElement.parentElement.id;
      } else if (e.target.classList.contains('delete-meal-use')) {
        id = e.target.parentElement.parentElement.parentElement.id;
      }
      const day = UICtrl.getDayFromPage();
      const dayData = StorageCtrl.getDayFromStorage(day);
      UICtrl.removeMealFromUI(id);
      StorageCtrl.removeMealFromDay(id, day, dayData);
      loadDayView(day);
    }
    
    e.preventDefault();
  };
  // Show meal info
  const showMealInfo = function(e) {
    if (e.target.classList.contains('btn--view')) {
      const id = e.target.parentElement.id;
      const day = UICtrl.getDayFromPage();
      const dayData = StorageCtrl.getDayFromStorage(day);
      UICtrl.showMealInfoUI(id, dayData, e.target);
    }
    e.preventDefault();
  };
  // Show today's meals
  const showToday = function() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date().getDay();
    const today = days[dayIndex];
    loadDayView(today);

    document.querySelectorAll(UISelectors.navLinks).forEach(link => {
      if (link.textContent === today) {
        UICtrl.setActiveLink(link);
      }
    }); 
  };
  // Show meal creation page from welcome screen
  const welcomeCreateMeal = function() {
    UICtrl.displayMealView();

    document.querySelectorAll(UISelectors.navLinks).forEach(link => {
      if (link.textContent === 'Create Meal') {
        UICtrl.setActiveLink(link);
      }
    }); 
  }
  // Public
  return {
    init: function() {
      loadEventListeners();
      UICtrl.displayCurrentDay();
    }
  }
})(IngredientCtrl, MealCtrl, UICtrl, StorageCtrl);

// Initialise app
App.init();