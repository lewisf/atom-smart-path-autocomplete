"use babel";
import {
  PATHS_LOADED,
  START_PATHS_LOAD,
  TERMINATE_PATHS_LOAD
} from '../constants/Actions'

const initialState = {
  paths: [],
  loaded: false,
  loading: false
};

export default function paths(state = initialState, action = {}) {
  switch (action.type) {
    case START_PATHS_LOAD:
      return {
        ...state,
        task: action.task
      };
    case PATHS_LOADED:
      return {
        ...state,
        loading: false,
        loaded: true,
        task: null,
        paths: action.result
      };
    case TERMINATE_PATHS_LOAD:
      state.task.terminate();
      return {
        ...state,
        loading: false,
        loaded: false,
        task: null,
      }
    default:
      return state;
  }
}
