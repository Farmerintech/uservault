import { useContext, useState } from "react";
import { BaseURL } from "./api";
import { UserContext } from "../context/provider";

export default function FileManager() {
  const [fileType, setFileType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { state } = useContext(UserContext);
  const token = state?.user?.token;

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
    if (!file || !fileType) {
      alert("Please select a file type and file.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploads");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dtsiyyvu1/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudRes.ok) {
        const errorData = await cloudRes.json().catch(() => ({}));
        throw new Error(
          `Cloud upload failed: ${cloudRes.status} ${
            cloudRes.statusText
          } ${errorData.message || ""}`
        );
      }

      const { secure_url } = await cloudRes.json();

      // 2️⃣ Send metadata to backend
      const backendRes = await fetch(`${BaseURL}/file/create_file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileType,
          filePath: secure_url,
        }),
      });

      if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({}));
        throw new Error(
          `Backend upload failed: ${backendRes.status} ${
            backendRes.statusText
          } ${errorData.message || ""}`
        );
      }

      alert("File uploaded successfully!");
      setFile(null);
      setPreview(null);
      setFileType("");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 flex flex-col max-w-md">
      <h2 className="text-xl font-bold mb-3">Upload File to Secure Cloud Storage</h2>

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

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-3"
        accept={
          fileType === "image"
            ? "image/*"
            : fileType === "pdf"
            ? ".pdf"
            : fileType === "docx"
            ? ".doc,.docx"
            : "*"
        }
      />

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

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}