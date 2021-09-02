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

export const groupBy = (xs, f) => {
  return xs.reduce(
    (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );
};

export const roundOff = (value) => {
  return value ? Math.round(value * 100) / 100 : value;
};
