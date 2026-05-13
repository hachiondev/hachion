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
    seoH1Title: row[2],
    courseImage: row[3],
    numberOfClasses: row[4],
    level: row[5],
    amount: row[6],
    discount: row[7],
    total: row[8],
    iamount: row[9],
    idiscount: row[10],
    itotal: row[11],
    courseCategory: row[12],
  }));
};
