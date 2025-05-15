import * as Yup from "yup";

export const emailValidationSchema =Yup.object().shape({
    recipients: Yup.string().required('Recipients cannot be empty'),
    subject: Yup.string().required('Subject cannot be empty'),
    content: Yup.string()
    .required("Body of the Email cannot be empty")
})