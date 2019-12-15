export const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);

export const pushToMap = (object, key, value) => {
  if (!object[key]) {
    object[key] = []; // eslint-disable-line no-param-reassign
  }
  object[key].push(value); // eslint-disable-line no-param-reassign
};
