export const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export const isEmptyObj = (obj) => {
  for (const key in obj) {
    if (
      obj[key] !== null &&
      obj[key] !== "" &&
      obj[key] !== false &&
      obj[key] !== undefined
    )
      return false;
  }
  return true;
};
