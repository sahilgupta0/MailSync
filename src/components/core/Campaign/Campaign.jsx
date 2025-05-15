import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { useFormik } from "formik";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { selectRecipient, selectTemplate } from "../../../redux/app/state";
import "./css/campaign.css";
import AutoDismissAlert from "../../../utils/AutoDismissAlert";
import Loading from "../../../utils/Loading";
import { increaseMailCount } from "../../../redux/global/userSlice";
import { fetchMails } from "../../../redux/global/mailSlice";
import { clearSelectedRecipientEmail } from "../../../redux/global/recipientsSlice";
import { clearSelectedTemplate } from "../../../redux/global/templateSlice";
import { emailValidationSchema } from "./validation/emailValidationSchema";
import { useNavigate } from "react-router-dom";

const Campaign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipientsEmail } = useSelector(selectRecipient);
  const { setTemplate } = useSelector(selectTemplate);
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [success, setSuccess] = useState(false);
  const initialRecipients = recipientsEmail.join(",") || "";
  const initialSubject = setTemplate.subject || "";
  const initialContent = setTemplate.content || "";

  const formik = useFormik({
    initialValues: {
      content: initialContent,
      recipients: initialRecipients,
      subject: initialSubject,
    },
    validationSchema: emailValidationSchema,
    onSubmit: async (values) => {
      try {
        setFailure(false);
        setSuccess(false);
        setLoading(true);
        values = {
          ...values,
          recipients: values.recipients.trim().split(","),
        };
        const response = await axios.post("/api/mail/sendBulkMail", values);
        formik.resetForm();

        dispatch(clearSelectedRecipientEmail());
        dispatch(clearSelectedTemplate());
        setSuccess(response.data.message);
        setLoading(false);
        dispatch(increaseMailCount());
        dispatch(fetchMails());
        setTimeout(()=>{
          navigate('/sent')
        },1500)
      } catch (error) {
        setSuccess(false);
        setFailure(error.response.data.message);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFailure(false);
      setSuccess(false);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [failure, success]);
  return (
    <Layout>
      <hgroup className="row justify-content-center ddd">
        <div className="col-lg-8">
          <div className="row justify-content-center">
            <div className="px-5">
              <header className="text-center">
                <h1 className="h4 text-color mb-4">Happy Mailing</h1>
              </header>
              <div className="mx-3">
                {failure && (
                  <AutoDismissAlert message={failure} type={"danger"} />
                )}
                {success && (
                  <AutoDismissAlert message={success} type={"success"} />
                )}
              </div>
              <form className="user" onSubmit={formik.handleSubmit}>
                <div className="col-lg-12 p-0 pb-4">
                  <input
                    type="text"
                    className={`form-control py-4  ${
                      formik.touched.recipients && formik.errors.recipients
                        ? "is-invalid"
                        : ""
                    }`}
                    name="recipients"
                    placeholder="recipients..."
                    value={formik.values.recipients}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.recipients && formik.errors.recipients && (
                    <span className="d-block ms-3 text-danger small invalid-feedback">
                      {formik.errors.recipients}
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
                  {/* <input
                    className="form-control form-control-lg fs-6 file-input"
                    id="formFileLg"
                    type="file"
                  /> */}
                  <ReactQuill
                    theme="snow"
                    placeholder="write something..."
                    className="h-75 border-0"
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
                    type="submit"
                    className="btn btn-primary btn-user btn-block col-sm-5 col-md-6 "
                    disabled={
                      !formik.values.subject ||
                      !formik.values.content ||
                      !formik.values.recipients
                    }
                  >
                    {loading ? <Loading /> : "Send"}
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

export default Campaign;
