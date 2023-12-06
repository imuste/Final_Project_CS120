let savedRecipes = [];
let currentRecipeIndex = 0;
let recipesArray = [];
var url_before = localStorage.getItem("country_url");
var userID = localStorage.getItem('user_id');
//console.log("userID" + userID);
var url = url_before.replace(/^"(.*)"$/, "$1"); // Removes quotes from the beginning and end of the string

const id_url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
// fetches array of recipes from mealsDB
async function use_mealDB_country() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        await process_country(data);
    } catch (error) {
        console.log(error);
    }
}
//processes data returned from the API, randomizing the data and selecting 5 dishes
async function process_country(data) {
    if (data && data.meals) {
        const meals = data.meals;
        const shuffledMeals = meals.sort(() => Math.random() - 0.5);
        const selectedRecipes = [];

        for (let i = 0; i < 5 && i < shuffledMeals.length; i++) {
            const { strMeal, idMeal } = shuffledMeals[i];
            selectedRecipes.push({ name: strMeal, id: idMeal });
        }

        await full_meal_lookups(selectedRecipes);
    } else {
        console.log("No meals found");
    }
}
// Refers to API again to obtain all information of a dish using its ID
async function full_meal_lookups(selectedRecipes) {
    for (let recipe of selectedRecipes) {
        await use_mealDB_id(recipe.id, true);
    }
}
//retrieves data from API, then sends to process function
async function use_mealDB_id(id, initialLoad) {
    try {
        const this_url = id_url + id;
        const response = await fetch(this_url);
        const data = await response.json();
        process_id(data, initialLoad);
    } catch (error) {
        console.log(error);
    }
}
//Stores recipe into either savedRecipes Array of recipesArray
function process_id(data, initialLoad) {
    var dishName = data.meals[0].strMeal;
    var youtubeURL = data.meals[0].strYoutube;
    var mealThumbnail = data.meals[0].strMealThumb;
    var instructions = data.meals[0].strInstructions;
    var ID = data.meals[0].idMeal;

    // Extracting ingredients and measures dynamically
    var ingredients = [];
    var measures = [];
    for (let i = 1; i <= 20; i++) {
        var ingredient = data.meals[0][`strIngredient${i}`];
        var measure = data.meals[0][`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push(ingredient);
            measures.push(measure);
        } else {
            break; // Stop if no more ingredients or measures are available
        }
    }

    var newRecipe = {
        name: dishName,
        youtubeURL: youtubeURL,
        thumbnail: mealThumbnail,
        instructions: instructions,
        id: ID,
        ingredients: ingredients,
        measures: measures
    };
    if (initialLoad){
        savedRecipes.push(newRecipe);
    }
    else{
        recipesArray.push(newRecipe);
    }
}

// displays currently selected Recipe from savedRecipes array, displaying all info
async function displaySavedRecipes() {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; // Clear the container before displaying updated content

    if (savedRecipes.length > 0) {
        const recipe = savedRecipes[currentRecipeIndex]; // Get the current recipe from the array

        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');

        const recipeName = document.createElement('h2');
        recipeName.textContent = recipe.name;

        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = recipe.thumbnail;
        thumbnailImg.alt = recipe.name;
        thumbnailImg.classList.add('recipe-thumbnail');

        const instructions = document.createElement('p');
        instructions.textContent = `Instructions: ${recipe.instructions}`;

        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Ingredients:';

        const ingredientsList = document.createElement('ul');
        recipe.ingredients.forEach((ingredient, index) => {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = `${recipe.measures[index]} ${ingredient}`;
            ingredientsList.appendChild(ingredientItem);
        });

        const viewButton = document.createElement('button');
        viewButton.textContent = "View on Youtube";
        viewButton.addEventListener('click', () => {
            if (recipe.youtubeURL) {
                window.open(recipe.youtubeURL, '_blank');
            } else {
                console.log("No YouTube URL available");
            }
        });


        recipeItem.appendChild(recipeName);
        recipeItem.appendChild(thumbnailImg);
        recipeItem.appendChild(instructions);
        recipeItem.appendChild(ingredientsTitle);
        recipeItem.appendChild(ingredientsList);
        recipeItem.appendChild(viewButton);

        recipesContainer.appendChild(recipeItem);

        // Create a button to save the recipe
        const saveButton = document.createElement('button');
        saveButton.textContent = "Save Recipe";
        saveButton.addEventListener('click', () => {
            const recipeID = recipe.id;
            saveRecipe(userID, recipeID); // Call the function to save the recipe
        });

        recipeItem.appendChild(saveButton); // Append the save button to the recipe item

    }
}
//function to call php script to add recipe and userId to assignment table
function saveRecipe(userID, recipeID) {
    fetch(`saveRecipe.php?userID=${userID}&recipeID=${recipeID}`)
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log the response (e.g., success message)
            // Handle success message or any additional actions
        })
        .catch(error => {
            console.error('Error saving recipe:', error);
        });
}


// function to display content on page
window.onload = async function () {
    savedRecipes = []; // Reset the array before fetching new recipes
    await use_mealDB_country();
    displaySavedRecipes();

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    

    // "Next" button functionality
    nextButton.addEventListener('click', () => {
        currentRecipeIndex = (currentRecipeIndex + 1) % savedRecipes.length;
        displaySavedRecipes();
    });

    // "Previous" button functionality
    prevButton.addEventListener('click', () => {
        currentRecipeIndex = (currentRecipeIndex - 1 + savedRecipes.length) % savedRecipes.length;
        displaySavedRecipes();
    });

    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    // displays menu items
    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
        createButtons(); // Create the button when dropdown is clicked
    });

    

    
}
// creates home button and view saved recipes button
function createButtons() {
    dropdownMenu.innerHTML = ''; // Clear previous content

    const homeButton = document.createElement('button');
    homeButton.textContent = "Home";
    homeButton.classList.add('menu-buttons'); // Corrected class addition for homeButton

    homeButton.addEventListener('click', () => {
        window.location.href = "home_page.html";
    });

    const orderButton = document.createElement('button');
    orderButton.textContent = 'View Saved Recipes';
    orderButton.classList.add('menu-buttons');

    orderButton.addEventListener('click', () => {
        sendUserIDToPHP(); // Send the userID to PHP when button is clicked
    });

    dropdownMenu.appendChild(homeButton);
    dropdownMenu.appendChild(orderButton);
}

// retrieves items to place in, and calls functions to placed in recipesArray.
async function sendUserIDToPHP() {
    recipesArray = [];
    try {
        var response = await fetch(`fetchSaved.php?user_id=${userID}`);
        var data = await response.json();

        var count = data.count;
        console.log('Count:', count);
        // Create an array to store promises
        var promises = data.recipeIDs.map(id => use_mealDB_id(id, false));
        // Wait for all promises to resolve
        await Promise.all(promises);
        // Log all recipes in recipesArray
        for (let recipe of recipesArray){
            console.log(recipe.id + " " + recipe.name)
        }
        // sets savedRecipes to then be accessed in next page
        localStorage.setItem("savedRecipes", JSON.stringify(recipesArray));
        
        window.location.href = "savedRecipes.html";
    } catch (error) {
        console.error('Error fetching OrderIDs:', error);
        // Handle the error, such as displaying an error message
    }
}




