
/**
 * Fetch recent blog posts
 * Returns transformed blog data with full image URLs
 */
export const getRecentBlogs = async () => {
  const response = await fetch("https://api.hachion.co/blog/recent");
  
  if (!response.ok) {
    throw new Error("Failed to fetch recent blogs");
  }
  
  const data = await response.json();
  
  if (!Array.isArray(data)) {
    throw new Error("Invalid blog data format");
  }
  
  // Transform array response to object format
  return data.map((row) => {
    const [
      id,
      category_name,
      title,
      author,
      author_image,
      blog_image,
      date,
    ] = row;

    const avatar = author_image
      ? `https://api.hachion.co/uploads/prod/blogs/${author_image}`
      : "";

    const blogImg = blog_image
      ? `https://api.hachion.co/uploads/prod/blogs/${blog_image}`
      : "";

    return {
      id,
      category_name,
      title,
      author,
      date,
      avatar,
      blog_image: blogImg,
    };
  });
};