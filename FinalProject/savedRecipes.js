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
            const item = document.createElement('div');
            item.classList.add('item-container');
            const recipeItem = document.createElement('div');
            recipeItem.classList.add('recipe-item');

            const recipeName = document.createElement('h2');
            recipeName.textContent = recipe.name;

            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = recipe.thumbnail;
            thumbnailImg.alt = recipe.name;
            thumbnailImg.classList.add('recipe-thumbnail');

            // YouTube button for each recipe
            const youtubeButton = document.createElement('button');
            youtubeButton.textContent = "Watch on YouTube";
            youtubeButton.classList.add('youtube-button');

            // Open YouTube URL in a new tab when YouTube button is clicked
            youtubeButton.addEventListener('click', () => {
                window.open(recipe.youtubeURL, '_blank');
            });

            // Details content (Ingredients and Instructions)
            const detailsContent = document.createElement('div');
            detailsContent.classList.add('details-content');
            detailsContent.innerHTML = `
                <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
                <p>Instructions: ${recipe.instructions}</p>
            `;

            recipeItem.appendChild(recipeName);
            recipeItem.appendChild(thumbnailImg);
            item.appendChild(recipeItem);

            item.appendChild(detailsContent); // Append the details content

            item.appendChild(youtubeButton); // Append the YouTube button

            item.classList.add('flex-container'); // Apply flexbox styling to the item

            recipesContainer.appendChild(item);
        });
    } else {
        // Handle the case when there are no saved recipes
        const noRecipesMessage = document.createElement('p');
        noRecipesMessage.textContent = "No saved recipes available.";
        recipesContainer.appendChild(noRecipesMessage);
    }
};
