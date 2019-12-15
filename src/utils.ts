export const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);

export const pushToMap = (object, key, value) => {
  if (!object[key]) {
    object[key] = [];
  }
  object[key].push(value);
};
