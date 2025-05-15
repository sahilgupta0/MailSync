import * as Yup from "yup";

export const recipientValidationSchema =Yup.object().shape({
    firstName: Yup.string().required('First Name cannot be empty'),
    lastName: Yup.string().required('Last Name cannot be empty'),
    email: Yup.string()
    .required("Email cannot be empty")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/,
      "Invalid email format"
    ),
})