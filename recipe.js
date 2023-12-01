// Define an array to store the saved recipes
let savedRecipes = [];
var urlString = "https://www.themealdb.com/api/json/v1/1/filter.php?a="
// URL to fetch the list of Mexican meals for testing
//var url = "https://www.themealdb.com/api/json/v1/1/filter.php?a=Mexican";

var url = localStorage.getItem("country_url");
url = url.replace(/^"(.*)"$/, "$1"); // Removes quotes from the beginning and end of the string

// URL to fetch details of a specific meal by ID
var id_url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

// Fetches a list of Mexican meals
async function use_mealDB_country(){
    try {
        const response = await fetch(url);
        const data = await response.json();
        await process_country(data);
    } catch (error) {
        console.log(error);
    }
}

// Processes the fetched list of meals
async function process_country(data){
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

// Fetches details of selected recipes by their IDs
async function full_meal_lookups(selectedRecipes){
    for (let recipe of selectedRecipes){
        await use_mealDB_id(recipe.id);
    }
}

// Fetches details of a specific recipe by ID
async function use_mealDB_id(id){
    try {
        const this_url = id_url + id;
        const response = await fetch(this_url);
        const data = await response.json();
        await process_id(data);
    } catch (error) {
        console.log(error);
    }
}

// Processes details of a specific recipe
function process_id(data){
    const dishName = data.meals[0].strMeal;
    const youtubeURL = data.meals[0].strYoutube;
    const mealThumbnail = data.meals[0].strMealThumb;
    const newRecipe = { name: dishName, youtubeURL: youtubeURL , thumbnail: mealThumbnail};
    savedRecipes.push(newRecipe);
}

// Displays the saved recipes with details
async function displaySavedRecipes() {
    savedRecipes = []; // Reset the array before fetching new recipes
    await use_mealDB_country();

    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; // Clear the container before displaying updated content

    savedRecipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.classList.add('recipe-item');

        const recipeName = document.createElement('p');
        recipeName.textContent = recipe.name;

        const thumbnailImg = document.createElement('img');
        thumbnailImg.src = recipe.thumbnail;
        thumbnailImg.alt = recipe.name;
        thumbnailImg.classList.add('recipe-thumbnail');

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
        recipeItem.appendChild(viewButton);

        recipesContainer.appendChild(recipeItem);
    });
}

// Call the function to display saved recipes when the page loads
window.onload = displaySavedRecipes;
