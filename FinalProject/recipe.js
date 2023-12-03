let savedRecipes = [];
let currentRecipeIndex = 0;

var url = localStorage.getItem("country_url");
url = url.replace(/^"(.*)"$/, "$1"); // Removes quotes from the beginning and end of the string

var id_url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

async function use_mealDB_country() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        await process_country(data);
    } catch (error) {
        console.log(error);
    }
}

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

async function full_meal_lookups(selectedRecipes) {
    for (let recipe of selectedRecipes) {
        await use_mealDB_id(recipe.id);
    }
}

async function use_mealDB_id(id) {
    try {
        const this_url = id_url + id;
        const response = await fetch(this_url);
        const data = await response.json();
        process_id(data);
    } catch (error) {
        console.log(error);
    }
}

function process_id(data) {
    const dishName = data.meals[0].strMeal;
    const youtubeURL = data.meals[0].strYoutube;
    const mealThumbnail = data.meals[0].strMealThumb;
    const instructions = data.meals[0].strInstructions;
    const ID = data.meals[0].idMeal;

    // Extracting ingredients and measures dynamically
    const ingredients = [];
    const measures = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = data.meals[0][`strIngredient${i}`];
        const measure = data.meals[0][`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients.push(ingredient);
            measures.push(measure);
        } else {
            break; // Stop if no more ingredients or measures are available
        }
    }

    const newRecipe = {
        name: dishName,
        youtubeURL: youtubeURL,
        thumbnail: mealThumbnail,
        instructions: instructions,
        id: ID,
        ingredients: ingredients,
        measures: measures
    };
    savedRecipes.push(newRecipe);
}


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
        // Inside displaySavedRecipes function

        // Create a button to save the recipe
        const saveButton = document.createElement('button');
        saveButton.textContent = "Save Recipe";
        saveButton.addEventListener('click', () => {
            const userID = localStorage.getItem('user_id');
            const recipeID = recipe.id;
            saveRecipe(userID, recipeID); // Call the function to save the recipe
        });

        recipeItem.appendChild(saveButton); // Append the save button to the recipe item

    }
}

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

    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
        createSaveButton(); // Create the button when dropdown is clicked
    });

    function createSaveButton() {
        dropdownMenu.innerHTML = ''; // Clear previous content

        const orderButton = document.createElement('button');
        orderButton.textContent = 'View Saved Recipes';
        orderButton.classList.add('order-button');

        orderButton.addEventListener('click', () => {
            sendUserIDToPHP(); // Send the userID to PHP when button is clicked
        });

        dropdownMenu.appendChild(orderButton);
    }

    function sendUserIDToPHP() {
        const userID = localStorage.getItem('user_id');
        console.log("userID" + userID);

        // AJAX request to send userID to PHP script
        fetch(`fetchSaved.php?user_id=${userID}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); 
                localStorage.setItem('savedRecipes', data);
                window.location.href="savedRecipes.html";
            })
            .catch(error => {
                console.error('Error fetching OrderIDs:', error);
            });
    }
};
