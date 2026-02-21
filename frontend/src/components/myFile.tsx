import { useState } from "react";
import axios from "axios";

interface FileType {
  _id: string;
  fileType: string;
  filePath: string;
}

export default function SingleFile() {
  const [fileId, setFileId] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [file, setFile] = useState<FileType | null>(null);
  const [error, setError] = useState("");

  const handleRetrieve = async () => {
    try {
      setError("");
      const res = await axios.post(`/api/files/${fileId}`, {
        secretCode
      });

      setFile(res.data.file);
    } catch (err: any) {
      setFile(null);
      setError("Invalid secret code or file not found");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Retrieve Single File</h2>

      <input
        type="text"
        placeholder="Enter File ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter Secret Code"
        value={secretCode}
        onChange={(e) => setSecretCode(e.target.value)}
      />

      <br /><br />

      <button onClick={handleRetrieve}>Retrieve File</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {file && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Type:</strong> {file.fileType}</p>

          {file.fileType === "image" ? (
            <img
              src={`/api/files/render/${file._id}`}
              alt="file"
              style={{ width: "250px", borderRadius: 8 }}
            />
          ) : (
            <a
              href={file.filePath}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Document
            </a>
          )}
        </div>
      )}
    </div>
  );
}