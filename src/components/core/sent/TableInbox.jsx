import React, { useState } from "react";
import { Link } from "react-router-dom";
import SelectLimit from "../Recipients/SelectLimit";
import Pagination from "../Recipients/Pagination";
import Loading from "../../../utils/Loading";
const InboxTable = ({ mails, handleDeleteOrder, process }) => {
  const pageLimits = [10, 15, 20];
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageLimits[0]);
  const [deletedMailId, setDeletedMailId] = useState(null);

  const getMails = (page, limit) => {
    let array = [];
    for (let i = (page - 1) * limit; i < page * limit && mails[i]; i++) {
      array.push(mails[i]);
    }
    return array;
  };

  const configuredMails = getMails(page, limit).map((row, index) => ({
    ...row,
    serialNumber: (page - 1) * limit + index + 1,
  }));

  const totalPage = Math.ceil(mails.length / limit);
  let pageNo;
  if (page <= totalPage) {
    pageNo = page;
  } else {
    setPage(totalPage);
    pageNo = page;
  }
  const onPageChange = (value) => {
    if (value === "&laquo;" || value === "... ") {
      setPage(1);
    } else if (value === "&lsaquo;") {
      if (page !== 1) {
        setPage(page - 1);
      }
    } else if (value === "&rsaquo;") {
      if (page !== totalPage) {
        setPage(page + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setPage(totalPage);
    } else {
      setPage(value);
    }
  };
  return (
    <main className="container d-flex justify-content-center table-responsive core-inbox">
      <table className="custom-table">
        <thead>
          <tr>
            <th scope="col">
              Your Mails
            </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {configuredMails.length === 0 ? (
            <tr className="text-center">
              <td colSpan={2} className="p-5 h3">
                No mails you have
              </td>
            </tr>
          ) : (
            configuredMails.map((row, index) => (
              <tr key={index}>
                <td className="pl-3">
                  {/* <span className="fs-6 m-0 text-capitalize fw-semibold"> */}
                    {row.subject}
                  {/* </span>{" "} */}
                </td>
  
                <td className="action-buttons text-center">
                  <Link
                    to={`/view-mail/${row._id}`}
                    className="btn bg-gradient-warning btn-sm"
                  >
                    <i className="bi bi-eye-fill"></i>
                  </Link>
                  <button
                    onClick={() => {
                      setDeletedMailId(row?._id);
                      handleDeleteOrder(row?._id);
                    }}
                    className="btn btn-danger btn-sm m-1"
                  >
                    {deletedMailId === row?._id && process ? (
                      <Loading color={"danger spinner-border-sm my-1"} />
                    ) : (
                      <i className="bi bi-trash-fill"></i>
                    )}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot className="table-footer bg-white">
          <tr>
            <td colSpan="5">
              <div className="d-flex justify-content-end pt-2">
                <SelectLimit onLimitChange={setLimit} pageLimits={pageLimits} />
                <Pagination
                  totalPage={totalPage}
                  page={pageNo}
                  limit={limit}
                  siblings={1}
                  onPageChange={onPageChange}
                />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </main>
  );
};

export default InboxTable;
