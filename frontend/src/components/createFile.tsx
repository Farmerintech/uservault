import { useState } from "react";
import axios from "axios";
import { BaseURL } from "./api";

export default function FileManager() {
  const [fileType, setFileType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (fileType === "image") {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    try {
      await axios.post(`${BaseURL}/file/create_file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-3">Create File</h2>

      <select
        value={fileType}
        onChange={(e) => setFileType(e.target.value)}
        className="mb-3 border p-2 rounded"
      >
        <option value="">Select File Type</option>
        <option value="image">Image</option>
        <option value="pdf">PDF</option>
        <option value="docx">DOCX</option>
      </select>

      <input type="file" onChange={handleFileChange} className="mb-3" />

      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Upload
      </button>

      {fileType === "image" && preview && (
        <div className="mt-5">
          <h3 className="font-semibold">Image Preview:</h3>
          <img src={preview} alt="preview" className="w-60 rounded" />
        </div>
      )}

      {fileType !== "image" && file && (
        <div className="mt-5">
          <p>Selected File: {file.name}</p>
        </div>
      )}
    </div>
  );
}