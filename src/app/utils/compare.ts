export const compareValue = (a: any, b: any, key = '') => {
  if (a[key] > b[key]) {
    return -1;
  }
  if (a[key] < b[key]) {
    return 1;
  }
  return 0;
};
