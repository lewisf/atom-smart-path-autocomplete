'use babel';

export function addPath(path) {
  return {
    type: 'ADD_PATH',
    path: path
  };
}

export function removePath(path) {
  return {
    type: 'REMOVE_PATH',
    path: path
  };
}
