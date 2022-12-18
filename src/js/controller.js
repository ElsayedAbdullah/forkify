import * as model from './model.js';
// Modular standard library for JavaScript. Includes polyfills for ECMAScript up to 2023
import 'core-js/stable';
// polyfilling async await
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';

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

const init = function () {
  recipeView.addHandlerRender(recipeController);
  searchView.addHandlerSearch(searchResultsController);
  paginationView.addHandlerClick(controlPagination);
  document.querySelector('.search__field').focus();
};

init();
