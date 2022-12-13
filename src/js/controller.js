import * as model from './model.js';
// Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2023
import 'core-js/stable';
// polyfilling async await
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const recipeController = async function () {
  try {
    // get the id from the url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Spinner
    recipeView.renderSpinner();

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
    // 1) Get query from Search Input
    const query = searchView.getQuery();

    // 2) Load Search Results
    await model.loadSearchResults(query);

    console.log(model.state.search.results);
  } catch (error) {
    console.error(error);
    // searchView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(recipeController);
  searchView.addHandlerSearch(searchResultsController);
};

init();
