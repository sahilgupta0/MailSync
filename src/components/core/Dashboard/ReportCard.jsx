import React from "react";
const ReportCard = ({ title, value, icon, loading }) => {
  return (
    <article className="col-xl-3 col-md-6 mb-4">
      <section className="card border-left-color shadow h-100 py-2">
        <main className="card-body mx-3">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className="text-xs font-weight-bold text-color text-uppercase mb-1">
                {title}
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                {loading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  value
                )}
              </div>
            </div>
            <div className="col-auto">{icon}</div>
          </div>
        </main>
      </section>
    </article>
  );
};

export default ReportCard;
