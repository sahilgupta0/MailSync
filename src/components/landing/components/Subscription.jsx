import React, { useState } from "react";
import axios from "axios";

const Subscription = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSuccess(false);
      setError(false);
      setLoading(true);
      const response = await axios.post("/api/mail/subscription", { email });
      setSuccess(response.data.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="footer-newsletter">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <h4>Subscribe to Our Newsletter</h4>
            <p>
              Stay updated with the latest news, features, and tips from Bulk
              Mailer. Join our newsletter for regular updates.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="btn btn-primary rounded-5">
                {loading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
            <div className="mt-2">
              {error && <span className="text-danger">{error}</span>}
              {success && <span className="text-success">{success}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
