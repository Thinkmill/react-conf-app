import { createAction } from "redux-actions";
import { AsyncStorage } from "react-native";
import update from "immutability-helper";
const STORE_RATING = "STORE_RATING";
const RESTORE_STATE_FROM_STORAGE = "RESTORE_STATE_FROM_STORAGE";

const storeRating = createAction(
  STORE_RATING,
  (talkTitle, rating, comment) => ({
    talkTitle,
    rating,
    comment
  })
);

const restoreStateFromStorage = createAction(
  RESTORE_STATE_FROM_STORAGE,
  state => ({ state })
);

export const actions = {
  storeRating,
  restoreStateFromStorage
};

export const reducer = (state, action) => {
  switch (action.type) {
    case STORE_RATING:
      const { talkTitle, rating, comment } = action.payload;
      state = update(state, {
        ratings: {
          [talkTitle]: { $set: { starCount: rating, comment: comment } }
        }
      });
      break;
    case RESTORE_STATE_FROM_STORAGE:
      return {
        ratings: action.payload.state.ratings
      };
      break;
  }

  return state;
};

export const selectors = {
  ratingForTalk: talkTitle => store => store.ratings[talkTitle]
};

export const storageMiddleware = store => next => action => {
  next(action);
  AsyncStorage.setItem("@NeosCon.state", JSON.stringify(store.getState()));
};
