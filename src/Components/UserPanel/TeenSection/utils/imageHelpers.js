export const resolveImageUrl = (img) => {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  return `https://api.test.hachion.co/${img.replace(/^\/+/, "")}`;
};
