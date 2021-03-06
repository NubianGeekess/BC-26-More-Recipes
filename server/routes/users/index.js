import express from 'express';

import Users from '../../controllers/users';
import Recipes from '../../controllers/recipes';
import Favorites from '../../controllers/favorites';
import Reviews from '../../controllers/reviews';
import Auth from '../../middleware/auth';
import {
  validateRecipeId,
  validateUserId,
} from '../../middleware/inputValidation';
import validateRecipeExist from '../../middleware/recipeValidation';

const user = express.Router();

const newUser = new Users();
const newRecipe = new Recipes();
const newFavorite = new Favorites();
const newAuth = new Auth();
const newReview = new Reviews();

user.post('/signup', newUser.signUp);
user.post('/signin', newUser.signIn);

user.use('*', newAuth.verify);
user.get('/myRecipes', newRecipe.getUserRecipes);

user.get('/:userId/profile', validateUserId, newUser.getUser);

user.put('/profile', newUser.modifyUser);

user.put('/changePassword', newUser.changePassword);

user.route('/recipes/:recipeId')
  .all(validateRecipeId, validateRecipeExist)
  .post(newFavorite.addToFavorites)
  .get(newFavorite.getFavRecipe)
  .delete(newFavorite.removeFromFavorites);

user.get('/:userId/recipes', validateUserId, newFavorite.getFavRecipes);
user.get('/:userId/reviews', validateUserId, newReview.getUserReviews);

export default user;
