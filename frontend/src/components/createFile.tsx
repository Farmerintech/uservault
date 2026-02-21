import { useState } from "react";
import axios from "axios";

export default function FileManager() {
  const [fileType, setFileType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* ==========================
     HANDLE FILE SELECT
  ========================== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // If image → generate preview
    if (fileType === "image") {
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  };

  /* ==========================
     CREATE FILE (UPLOAD)
  ========================== */
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    await axios.post("/api/files", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Uploaded successfully");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create File</h2>

      <select
        value={fileType}
        onChange={(e) => setFileType(e.target.value)}
      >
        <option value="">Select File Type</option>
        <option value="image">Image</option>
        <option value="pdf">PDF</option>
        <option value="docx">DOCX</option>
      </select>

      <input type="file" onChange={handleFileChange} />

      <button onClick={handleUpload}>Upload</button>

      <hr />

      {/* ==========================
          IMAGE PREVIEW
      ========================== */}
      {fileType === "image" && preview && (
        <div>
          <h3>Image Preview:</h3>
          <img
            src={preview}
            alt="preview"
            style={{ width: "250px", borderRadius: 8 }}
          />
        </div>
      )}

      {/* ==========================
          PDF/DOCX UI
      ========================== */}
      {fileType !== "image" && file && (
        <div>
          <p>Selected File: {file.name}</p>
        </div>
      )}
    </div>
  );
}