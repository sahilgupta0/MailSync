import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import Loading from "../../utils/Loading";
import { setSuccess } from "../../redux/global/userSlice";

const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(true);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .transform((value) => (value ? value.trim() : value))
        .required("Required"),
      confirmPassword: Yup.string()
        .transform((value) => (value ? value.trim() : value))
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setError(false);
        setLoading(true);
        console.log(values)
        const response = await axios.post(
          `/api/auth/reset-password/${params.token}`,
          values
        );
        console.log(response.data)
        dispatch(setSuccess(response.data.message));
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError(error.response.data.message);
      }
    },
  });

  return (
    <div className="m-0 p-0  user-body">
      <main className="container pb-5 min-vh-100">
        {/* Outer Row */}
        <hgroup className="row justify-content-center">
          <section className="col-xl-10 col-lg-12 col-md-9">
            <div
              className="card o-hidden border-0 shadow-lg my-5"
              style={{ backgroundColor: "#ddd" }}
            >
              <section className="card-body p-0">
                {/* Nested Row within Card Body */}
                <div className="row">
                  <figure className="col-lg-6 d-none d-lg-block bg-password-image m-0"></figure>
                  <section className="col-lg-6 p-5">
                    <hgroup className="d-flex justify-content-center user-heading">
                      <h1 className="text-center h1">BULK MAILER</h1>
                    </hgroup>
                    <header className="text-center">
                      <h1 className="h4 text-gray-900 mb-2">
                        Reset Your Password
                      </h1>
                    </header>
                    <form className="user" onSubmit={formik.handleSubmit}>
                      {error && (
                        <section className="alert alert-danger" role="alert">
                          {error}
                        </section>
                      )}
                      <fieldset className="form-group">
                        <input
                          type={showPassword ? "password" : "text"}
                          className={`form-control form-control-user ${
                            formik.touched.password && formik.errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          id="password"
                          placeholder="password"
                          name="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                          <span className="d-block ms-3 text-danger small invalid-feedback">
                            {formik.errors.password}
                          </span>
                        )}
                      </fieldset>
                      <fieldset className="form-group">
                        <input
                          type={showPassword ? "password" : "text"}
                          className={`form-control form-control-user ${
                            formik.touched.confirmPassword && formik.errors.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}
                          id="confirmPassword"
                          placeholder="password"
                          name="confirmPassword"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.confirmPassword &&
                          formik.errors.confirmPassword && (
                            <span className="d-block ms-3 text-danger small invalid-feedback">
                              {formik.errors.confirmPassword}
                            </span>
                          )}
                      </fieldset>
                      <div className="custom-control custom-checkbox small my-3">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="showPassword"
                          name="showPassword"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="showPassword"
                        >
                          show password
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-user btn-block"
                      >
                        {loading ? <Loading /> : "Reset Your Password"}
                      </button>
                    </form>
                    <div className="text-center">
                      <Link className="small" to={"/forgot-password"}>
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="text-center">
                      <Link className="small" to={"/register"}>
                        Create an Account!
                      </Link>
                    </div>
                  </section>
                </div>
              </section>
            </div>
          </section>
        </hgroup>
      </main>
    </div>
  );
};

export default ResetPassword;
