window.onload = function () {
    const recipesContainer = document.getElementById('recipes-container');
    const returnHomeButton = document.getElementById('returnHome');

    // Event listener for the "Return Home" button
    returnHomeButton.addEventListener('click', () => {
        window.location.href = "home_page.html"; // Replace "index.html" with your home page
    });

    const recipesData = localStorage.getItem("savedRecipes");

    if (recipesData) {
        const recipesArray = JSON.parse(recipesData);
        recipesArray.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.classList.add('recipe-item');

            const recipeName = document.createElement('h2');
            recipeName.textContent = recipe.name;

            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = recipe.thumbnail;
            thumbnailImg.alt = recipe.name;
            thumbnailImg.classList.add('recipe-thumbnail');

            // "More" button for each recipe
            const moreButton = document.createElement('button');
            moreButton.textContent = "More";
            moreButton.classList.add('more-button');
            

            // Append the elements to recipeItem (as per your design)
            recipeItem.appendChild(recipeName);
            recipeItem.appendChild(thumbnailImg);
            recipeItem.appendChild(moreButton);
            // ... Append other elements as needed

            recipesContainer.appendChild(recipeItem);

            // Add event listener for "More" button
            moreButton.addEventListener('click', () => {
                displayRecipeDetails(recipe);
            });
        });
    } else {
        // Handle the case when there are no saved recipes
        const noRecipesMessage = document.createElement('p');
        noRecipesMessage.textContent = "No saved recipes available.";
        recipesContainer.appendChild(noRecipesMessage);
    }
};

function displayRecipeDetails(recipe) {
    const recipeDetails = `
        Instructional Youtube URL: ${recipe.youtubeURL}\n
        Ingredients: ${recipe.ingredients.join(', ')}\n
        Instructions: ${recipe.instructions}
    `;

    alert(recipeDetails);
}
