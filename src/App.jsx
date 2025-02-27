import { useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import * as XLSX from "xlsx";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setProcessed(false);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
  
    let finalFileName = outputFileName.trim();
    if (!finalFileName) {
      setError("Output file name is required.");
      return;
    }
  
    // Ensure the file name always ends with .xlsx
    if (!finalFileName.toLowerCase().endsWith(".xlsx")) {
      finalFileName += ".xlsx";
    }
  
    setOutputFileName(finalFileName); // Update state with corrected filename
    setLoading(true);
    setProcessed(false);
    setError("");
  
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
  
    try {
      const response = await axios.post("https://quizzscriptbackend.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setJsonData(response.data.data);
      setProcessed(true);
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setLoading(false);
    }
  };
  

  const downloadExcel = () => {
    if (!jsonData) return;

    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consolidated Data");

    XLSX.writeFile(workbook, outputFileName || "output.xlsx");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload Excel Files</h2>

        <input type="file" multiple onChange={handleFileChange} className="file-input" />

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={index} className="file-item">
                {file.name}
                <button className="remove-btn" onClick={() => removeFile(index)}>X</button>
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          className="filename-input"
          placeholder="Enter output file name"
          value={outputFileName}
          onChange={(e) => {
            setOutputFileName(e.target.value);
            setError("");
          }}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="upload-btn" onClick={handleUpload} disabled={loading || !outputFileName.trim()}>
          {loading ? <span className="loader"></span> : "Upload"}
        </button>

        {processed && (
          <div className="success-container">
            <FaCheckCircle className="success-icon" />
            <p>Processing Complete!</p>
          </div>
        )}

        {processed && (
          <button className="download-btn" onClick={downloadExcel}>
            Download Processed File
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
