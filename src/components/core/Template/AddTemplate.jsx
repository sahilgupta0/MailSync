import React, { useState } from "react";
import Layout from "../layout/Layout";
import { useFormik } from "formik";
import FieldConfig from "../vendors/utils/FieldConfig";
import TextArea from "../vendors/utils/TextArea";
import { templateValidationSchema } from "./validations/templateValidationSchema";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addTemplateFailure,
  addTemplateStart,
  addTemplateSuccess,
} from "../../../redux/global/templateSlice";
import axios from "axios";
import { selectTemplate } from "../../../redux/app/state";
import Loading from "../../../utils/Loading";
import AutoDismissAlert from "../../../utils/AutoDismissAlert";
import ReactQuill from "react-quill";

const AddTemplate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(selectTemplate);
  const [failure, setFailure] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      subject: "",
      content: "",
    },
    validationSchema: templateValidationSchema,
    onSubmit: async (values) => {
      try {
        setFailure(false);
        dispatch(addTemplateStart());
        const trimmedValues = Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, value.trim()])
        );
        const response = await axios.post(
          "/api/template/add-template",
          trimmedValues
        );
        dispatch(addTemplateSuccess(response.data));
        navigate("/template");
      } catch (error) {
        dispatch(addTemplateFailure(false));
        setFailure(error.response.data.message);
      }
    },
  });
  return (
    <Layout>
      <hgroup className="row justify-content-center">
        <div className="col-lg-8">
          <div className="row justify-content-center">
            <div className="px-5">
              <hgroup className="d-flex justify-content-center user-heading">
                <h1 className="text-center text-color h3">ADD TEMPLATE</h1>
              </hgroup>

              <header className="text-center">
                <h1 className="h4 text-black mb-4">Happy to Mailing</h1>
              </header>
              <div className="mx-3">
                {failure && (
                  <AutoDismissAlert message={failure} type={"danger"} />
                )}
              </div>
              <form className="user" onSubmit={formik.handleSubmit}>
                <div className="col-lg-12 p-0 pb-4">
                  <input
                    type="text"
                    className={`form-control py-4  ${
                      formik.touched.title && formik.errors.title
                        ? "is-invalid"
                        : ""
                    }`}
                    name="title"
                    placeholder="title..."
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <span className="d-block ms-3 text-danger small invalid-feedback">
                      {formik.errors.title}
                    </span>
                  )}
                </div>
                <div className="col-lg-12 p-0 pb-4">
                  <input
                    type="text"
                    className={`form-control py-4  ${
                      formik.touched.subject && formik.errors.subject
                        ? "is-invalid"
                        : ""
                    }`}
                    name="subject"
                    placeholder="subject..."
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <span className="d-block ms-3 text-danger small invalid-feedback">
                      {formik.errors.subject}
                    </span>
                  )}
                </div>
                <div className="col-lg-12 p-0 position-relative">
                  <ReactQuill
                    theme="snow"
                    placeholder="write something..."
                    className={`${
                      formik.touched.content && formik.errors.content
                        ? "is-invalid"
                        : ""
                    }`}
                    value={formik.values.content}
                    onChange={(content) => {
                      formik.handleChange("content")(content);
                    }}
                    onBlur={() => formik.setFieldTouched("content", true)}
                  />
                  {formik.touched.content && formik.errors.content && (
                    <span className="d-block ms-3 text-danger small invalid-feedback">
                      {formik.errors.content}
                    </span>
                  )}
                </div>
                <div className="text-center mt-2">
                  <button
                    className="btn btn-primary btn-user btn-block col-sm-5 col-md-6"
                    type="submit"
                  >
                    {loading ? <Loading /> : "ADD"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </hgroup>
    </Layout>
  );
};

export default AddTemplate;
