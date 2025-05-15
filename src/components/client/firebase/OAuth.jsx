import React, { useState } from "react";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase";
import { useDispatch } from "react-redux";
import { logInFailure, logInSuccess } from "../../../redux/global/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      setLoading(true);
      const response = await axios.post(`/api/auth/login-with-google`, {
        token: result.user.accessToken,
      });
      if (response.status === 200) {
        dispatch(logInSuccess(response.data));
        navigate("/dashboard");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error logIn with google ", error);
      dispatch(
        logInFailure({
          message: "Google could not find you please try again",
        })
      );
    }
  };
  return (
    <button
      className="btn btn-google btn-user btn-block text-white"
      type="button"
      onClick={logInWithGoogle}
    >
      {loading ? (
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <span>
          <i className="bi bi-google" /> Login with Google
        </span>
      )}
    </button>
  );
};

export default OAuth;
