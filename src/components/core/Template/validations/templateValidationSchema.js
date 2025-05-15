import * as Yup from "yup";


export const templateValidationSchema =Yup.object().shape({
    title: Yup.string().required('Title cannot be empty'),
    subject: Yup.string().required('Subject cannot be empty'),
    content: Yup.string().required("Content cannot be empty")
})