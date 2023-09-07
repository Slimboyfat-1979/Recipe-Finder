import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './views/config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function() {
    try{
      const id = window.location.hash.slice(1);
      if(!id) {
        return;
      }

      resultsView.update(model.getSearchResultsPage());
      bookmarksView.update(model.state.bookmarks);

      recipeView.renderSpinner();

      await model.loadRecipe(id);

      //2. Recipe Render
      recipeView.render(model.state.recipe);
     
    }catch(err) {
      recipeView.renderError();
      console.log(err)
    }


};

const controlSeachResults = async function() {
    try {

      resultsView.renderSpinner();
   

      //1. Get Search Query
      const query = searchView.getQuery();
      if(!query) {
        return;
      }
      //2. Load Search Results
      await model.loadSearchResults(query);

      //3.Render Results
      resultsView.render(model.getSearchResultsPage());

      //4. Render initial pagination button
      paginationView.render(model.state.search)
    }catch(err) {
        console.log(err);
    }
};

const controlPagination = function(goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
}


const controlServings = function(newServings) {
  //Update the recipe servings
  model.updateServings(newServings);

  //Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
  if(!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }else {
    model.deleteBookmark(model.state.recipe.id);
  }
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe) {
  try{
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe

    recipeView.render(model.state.recipe);

    //Success
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);


    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000);

  }catch(err) {
    console.error('🍔🍕🍕',err);
    addRecipeView.renderError(err.message)
  }
 

  //Upload the new recipe data;
}

const newFeature = function() {
  console.log('Welcome to the application');
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSeachResults);
  paginationView.addHanderClick(controlPagination); 
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
}

init();



        

