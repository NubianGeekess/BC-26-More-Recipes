import React, { PureComponent } from 'react';
import PropTypes, { object } from 'prop-types';
import { connect } from 'react-redux';
import Toastr from 'toastr';

import Header from '../header';
import View from './view';
import Footer from '../commons/Footer';

import { fetchRecipeDetails } from '../../actions/recipeActions';
import {
  fetchSingleFavorite, addFav, removeFav
} from '../../actions/favActions';
import { upvote, downvote } from '../../actions/voteActions';

import {
  fetchRecipeReviews, addRecipeReview
} from '../../actions/reviewActions';

/**
 * Container component for fetching recipe details
 *
 * @class RecipeDetails
 * @param {string} key
 * @param {string} value
 * @extends {PureComponent}
 */
class RecipeDetails extends PureComponent {
  /**
   * Creates an instance of RecipeDetails.
   * @param {any} props
   * @memberof RecipeDetails
   */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      index: 0,
      content: '',
      posting: false,
      error: ''
    };
  }

  /**
   * Component will mount
   *
   * @memberof RecipeDetails
   * @returns {null} Nothing
   */
  componentWillMount() {
    const { id } = this.props.match.params;

    this.setState({
      isLoading: true
    });

    this.props.fetchRecipeDetails(id)
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        });
        const { data: { message } } = error.response;
        Toastr.error(message);
      });

    this.props.fetchSingleFavorite(this.props.userId, id);
    this.props.fetchRecipeReviews(id);
  }

  addFav = () => {
    this.props.addFav(this.props.recipe.id, this.props.userId)
      .catch((error) => {
        this.setState({ error: error.response.data.message });
      });
  }

  removeFav = () => {
    this.props.removeFav(this.props.recipe.id, this.props.userId)
      .catch((error) => {
        this.setState({ error: error.response.data.message });
      });
  }

  upvote = () => {
    Toastr.clear();
    this.props.upvote(this.props.recipe.id)
      .then(() => {
        Toastr.success('Recipe upvoted');
      })
      .catch((error) => {
        Toastr.error(error.response.data.message);
      });
  }

  downvote = () => {
    Toastr.clear();
    this.props.downvote(this.props.recipe.id)
      .then(() => {
        Toastr.success('Recipe downvoted');
      })
      .catch((error) => {
        Toastr.error(error.response.data.message);
      });
  }

  storeToState = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  addReview = () => {
    const { content } = this.state;
    this.setState({
      posting: true,
      index: 0
    });

    this.props.addRecipeReview(this.props.recipe.id, { content })
      .then(() => {
        this.setState({
          posting: false,
          content: ''
        });
      })
      .catch((error) => {
        this.setState({
          posting: false
        });
        Toastr.error(error.response.data.message);
      });
  }

  /**
   * Renders component
   *
   * @returns {null} Nothing
   * @memberof RecipeDetails
   */
  render() {
    return (
      <div className="body">
        <Header />
        <main>
          <div className="push-down">
            <View
              recipe={this.props.recipe}
              reviews={this.props.reviews}
              index={this.state.index}
              isFav={this.props.isFav}
              actions={{
                removeFav: this.removeFav,
                addFav: this.addFav,
                upvote: this.upvote,
                downvote: this.downvote,
                storeToState: this.storeToState,
                addReview: this.addReview
              }}
              loading={this.state.isLoading}
              posting={this.state.posting}
              newReview={this.state.content}
              error={this.state.error}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.user.id,
  recipe: state.recipe.currentRecipe,
  reviews: state.review.reviews,
  isFav: state.favorite.isFav
});

RecipeDetails.propTypes = {
  reviews: PropTypes.arrayOf(object).isRequired,
  isFav: PropTypes.bool.isRequired,
  addRecipeReview: PropTypes.func.isRequired,
  downvote: PropTypes.func.isRequired,
  upvote: PropTypes.func.isRequired,
  removeFav: PropTypes.func.isRequired,
  addFav: PropTypes.func.isRequired,
  recipe: PropTypes.shape().isRequired,
  fetchSingleFavorite: PropTypes.func.isRequired,
  fetchRecipeReviews: PropTypes.func.isRequired,
  fetchRecipeDetails: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  match: PropTypes.shape().isRequired
};

const actionCreators = {
  fetchRecipeDetails,
  fetchRecipeReviews,
  fetchSingleFavorite,
  removeFav,
  addFav,
  upvote,
  downvote,
  addRecipeReview
};


export default connect(mapStateToProps, actionCreators)(RecipeDetails);