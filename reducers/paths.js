"use babel";
import {
  PATHS_LOADED,
  START_PATHS_LOAD,
  TERMINATE_PATHS_LOAD
} from '../constants/Actions'

const initialState = {
  paths: [],
  loaded: false,
  loading: false,
  loadStartTime: null
};

export default function paths(state = initialState, action = {}) {
  switch (action.type) {
    case START_PATHS_LOAD:
      return {
        ...state,
        task: action.task,
        loadStartTime: new Date()
      };
    case PATHS_LOADED:
      if (state.loadStartTime) {
        let ms = new Date() - state.loadStartTime;
        console.log(`Loading paths took: ${ms} milliseconds`);
      }
      return {
        ...state,
        loading: false,
        loaded: true,
        task: null,
        paths: action.result,
        loadStartTime: null
      };
    case TERMINATE_PATHS_LOAD:
      state.task && state.task.terminate();
      return {
        ...state,
        loading: false,
        loaded: false,
        task: null,
        loadStartTime: null,
      }
    default:
      return state;
  }
}
