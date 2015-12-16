'use babel';

var arrayToObject = (items) => {
  return items.reduce(function(obj, str) {
      obj[str] = str;
      return obj;
    },
    {}
  );
}

const initialState = {
  paths: new Map(),
};

export default function paths(state = initialState, action = {}) {
  switch (action.type) {
  case 'ADD_PATH':
    return {
      ...state,
      paths: state.paths.set(action.path, action.path)
    };
  case 'ADD_PATHS':
    return {
      ...state,
      paths: action.paths.reduce((memo, path) => {
        return memo.set(path, path);
      }, state.paths)
    };
  case 'REMOVE_PATH':
    // TODO: Immutable here
    state.paths.delete(action.path);
    return {
      ...state
    };
  case 'REMOVE_PATHS':
    var tmpPaths = state.paths;
    action.paths.forEach(path => tmpPaths.delete(path));
    return {
      ...state,
      paths: tmpPaths
    }
  default:
    return {...state}
  }
}
