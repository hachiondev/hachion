import React, { useState } from 'react';
import axios from 'axios';

const ImportLead = () => {

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://api.test.hachion.co/register-student/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      setError("");

    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Upload failed. Please try again.");
      }

      setResult(null);
    }
  };

  return (
    <div className="import-lead-form">
      <form onSubmit={handleUpload}>

     

        <div className='lead-form'>
          <div className="mb-3">

            <label htmlFor="formFile" className="form-label">
              Upload Excel file
            </label>

            <input
              className="form-control"
              type="file"
              id="formFile"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />

            <p>
              Note: Upload the Leads carefully using Excel file format.
            </p>

            <button type="submit" className='upload-btn'>
              Upload
            </button>

            {/* 🔥 ERROR MESSAGE */}
            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>
                {error}
              </p>
            )}

          </div>
        </div>
      </form>

      {/* 🔥 SUCCESS RESULT UI */}
    {result && (
  <div style={{
    marginTop: "30px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }}>

    <h4 style={{
      marginBottom: "20px",
      borderBottom: "1px solid #eee",
      paddingBottom: "10px"
    }}>
      Upload Summary
    </h4>

    {/* Summary Cards */}
    <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>

      <div style={{
        flex: 1,
        background: "#f5f5f5",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <p style={{ margin: 0, color: "#666" }}>Total no of Students in File</p>
        <h3 style={{ margin: 0 }}>{result.totalRecords}</h3>
      </div>

      <div style={{
        flex: 1,
        background: "#e6f7ff",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <p style={{ margin: 0, color: "#666" }}>Updated students in DB</p>
        <h3 style={{ margin: 0 }}>{result.savedRecords}</h3>
      </div>

      <div style={{
        flex: 1,
        background: "#fff1f0",
        padding: "12px",
        borderRadius: "8px",
        textAlign: "center"
      }}>
        <p style={{ margin: 0, color: "#666" }}>Duplicate students</p>
        <h3 style={{ margin: 0 }}>{result.duplicateRecords}</h3>
      </div>

    </div>

    {/* Duplicate Sections */}
    <div style={{ display: "flex", gap: "20px" }}>

      {/* DB duplicates */}
      <div style={{ flex: 1 }}>
        <h5 style={{ marginBottom: "10px" }}>DB Duplicate Emails</h5>

        {result.dbDuplicateEmails?.length > 0 ? (
          <ul style={{ paddingLeft: "18px" }}>
            {result.dbDuplicateEmails.map((email, index) => (
              <li key={index} style={{ color: "#d32f2f", marginBottom: "4px" }}>
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>No DB duplicates</p>
        )}
      </div>

      {/* Excel duplicates */}
      <div style={{ flex: 1 }}>
        <h5 style={{ marginBottom: "10px" }}>Excel Duplicate Emails</h5>

        {result.excelDuplicateEmails?.length > 0 ? (
          <ul style={{ paddingLeft: "18px" }}>
            {result.excelDuplicateEmails.map((email, index) => (
              <li key={index} style={{ color: "#d32f2f", marginBottom: "4px" }}>
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#888" }}>No Excel duplicates</p>
        )}
      </div>

    </div>

  </div>
)}

    </div>
  );
};

export default ImportLead;