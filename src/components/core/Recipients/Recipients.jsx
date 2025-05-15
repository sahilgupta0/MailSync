import React, { useEffect, useMemo, useState } from "react";
import Layout from "../layout/Layout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  clearRecipientMessages,
  deleteRecipientFailure,
  deleteRecipientStart,
  deleteRecipientSuccess,
  fetchRecipient,
  setSelectedRecipientEmail,
} from "../../../redux/global/recipientsSlice";

import axios from "axios";
import { selectRecipient } from "../../../redux/app/state";
import AutoDismissAlert from "../../../utils/AutoDismissAlert";
import Loading from "../../../utils/Loading";
import RecipientTable from "./RecipientTable";
import { decreaseRecipientCount } from "../../../redux/global/userSlice";

const Recipients = () => {
  const dispatch = useDispatch();
  const { recipients, error, success, loading } = useSelector(selectRecipient);
  const [process, setProcess] = useState(false)
  const [excelData, setExcelData] = useState([]);
  useEffect(() => {
    if (recipients.length === 0) {
      dispatch(fetchRecipient());
    }
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(clearRecipientMessages());
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error, success, loading]);

  const handleDeleteOrder = async (recipientId) => {
    try {
      setProcess(true)
      dispatch(deleteRecipientStart());
      const response = await axios.delete(
        `/api/recipient/delete-recipient/${recipientId}`
      );
      dispatch(deleteRecipientSuccess(response.data));
      dispatch(decreaseRecipientCount())
      setProcess(false)
    } catch (error) {
      dispatch(deleteRecipientFailure(error.response.data));
      setProcess(false)
    }
  };

  const handleGetTotalEmails = () => {
    const allEmails = recipients.map((row) => row.email);
    dispatch(setSelectedRecipientEmail(allEmails));
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        console.log("workbook", workbook);

        if (workbook.SheetNames.length === 0) {
          console.error("No sheets found in the Excel file.");
          return;
        }
        const sheetName = workbook.SheetNames[0];

        console.log("Sheet Name:", sheetName); // Debugging outpu
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
          console.error("Sheet data is empty or invalid.");
          return;
        }
        const parsedData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        console.log("Parsed Data:", parsedData); // Debugging output
        if (parsedData.length === 0) {
          console.error("No data found in the sheet.");
          return;
        }

        const formattedData = parsedData.map((row) => ({
          firstName: row["First-Name"] || "",
          lastName: row["Last-Name"] || "",
          email: row["E-mail"] || "",
        }));

        const call_api = async (recipient) => {
          try {
            const response = await axios.post(
              "/api/recipient/add-recipient",
              recipient
            );
            console.log("Response:", response.data);
          } catch (error) {
            console.error("Error adding recipients:", error);
          }
        }

        // console.log("Formatted Data:", formattedData); // Debugging output
        
        // setExcelData(formattedData); // Update state with formatted data

        // Add each recipient to the backend
      for (const recipient of formattedData) {
        try {
          call_api(recipient);
          console.log(`Added recipient: ${recipient.email}`);
        } catch (error) {
          console.error(`Failed to add recipient: ${recipient.email}`, error);
        }
      }

      // Refresh the recipients list after adding all recipients
      dispatch(fetchRecipient());
      
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Layout>
      <hgroup className="row justify-content-around mb-4">
        <div className="col-md-12">
          <h1 className="h3 mb-0 text-gray-800 text-center">Recipients</h1>
        </div>
        <div className="col-md-6 mt-3 text-center">
          <Link
            to={"/add-recipient"}
            className="m-2 btn bg-gradient-primary text-white shadow-sm "
          >
            <i className="bi bi-plus text-white"></i>
            Add recipients
          </Link>
          <Link
            to={"/campaign"}
            className="btn bg-gradient-warning text-white shadow-sm "
            onClick={handleGetTotalEmails}
            disabled={recipients.length === 0}
          >
            <i className="bi bi-mailbox text-white px-2"></i>
            Send Mail
          </Link>

          <label className="btn bg-gradient-success text-white shadow-sm m-2">
            <i className="bi bi-upload text-white px-2"></i>
            Upload the Excel File
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              style={{ display: "none" }}
            />
          </label>

        </div>
      </hgroup>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9 col-md-12">
          <div className="mx-3">
            {success && (<AutoDismissAlert message={success} type={"success"} />)}
            {error && (
              <AutoDismissAlert message={error.message} type={"danger"} />
            )}
          </div>
          {loading ? (
            <Loading color={"text-color"} />
          ) : (
            <RecipientTable
              recipients={excelData.length > 0 ? excelData : recipients}
              handleDeleteOrder={handleDeleteOrder}
              process={process}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Recipients;
