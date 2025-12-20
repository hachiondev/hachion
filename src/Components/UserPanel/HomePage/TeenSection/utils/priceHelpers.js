
export const fmtNumber = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString();

export const convertByRate = (value, rate = 1) => {
  const v = Number(value) || 0;
  return v * rate;
};
