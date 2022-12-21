import * as model from './model.js';
// Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2023
import 'core-js/stable';
// polyfilling async await
import 'regenerator-runtime/runtime';
import addRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const recipeController = async function () {
  try {
    // get the id from the url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Spinner
    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    // console.error(error);
    recipeView.renderError();
  }
};

const searchResultsController = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get query from Search Input
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load Search Results
    await model.loadSearchResults(query);

    // 3) render intial results
    resultsView.render(model.getSearchResultsPage());

    // 4) render intial pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    // searchView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  // update the recipe servings in the state
  model.updateServings(updateTo);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or Remove Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // console.log(model.state.recipe);
  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Upload new recipe
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  // this is the first handler to do because it bring the data from local storage
  bookmarksView.addHandlerRenderBookmark(controlBookmark);
  recipeView.addHandlerRender(recipeController);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(searchResultsController);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  document.querySelector('.search__field').focus();
};

init();
