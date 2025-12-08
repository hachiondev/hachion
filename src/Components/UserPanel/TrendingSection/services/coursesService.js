import axios from "axios";

export const getTrendingCourses = async () => {
  const { data } = await axios.get("https://api.test.hachion.co/trendingcourse");
  return data || [];
};

export const getCoursesSummary = async () => {
  const { data } = await axios.get("https://api.test.hachion.co/courses/summary");
  const raw = data || [];
  return raw.map(row => ({
    id: row[0],
    courseName: row[1],
    courseImage: row[2],
    numberOfClasses: row[3],
    level: row[4],
    amount: row[5],
    discount: row[6],
    total: row[7],
    iamount: row[8],
    idiscount: row[9],
    itotal: row[10],
    courseCategory: row[11],
  }));
};
