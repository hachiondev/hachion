import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
  name: Yup.string().min(2).max(25).required("Please enter your name"),
  comment: Yup.string().min(20).max(400).required("Please enter your comment"),
  number: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number format")
    .required("Mobile number is required"),
  company_name: Yup.string()
    .min(4)
    .max(50)
    .required("Please enter valid company name"),
  course_name: Yup.string().min(4).max(50).required("Please enter course name"),
});
