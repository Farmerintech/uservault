import { useEffect, useState, useContext } from "react";
import { BaseURL } from "./api";
import { UserContext } from "../context/provider";

interface FileType {
  _id: string;
  fileType: string;
  filePath: string;
  createdAt: string;
}

export default function AllFiles() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContext(UserContext);
  const token = state?.user?.token;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${BaseURL}/file/get_files`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to fetch files: ${res.status} ${res.statusText} ${
              errData.message || ""
            }`
          );
        }

        const data = await res.json();
        setFiles(data.files || []);
      } catch (error: any) {
        console.error("Error fetching files:", error);
        alert(`Error fetching files: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [token]);

  if (loading) return <p>Loading files...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>All My Files</h2>

      <div style={{ display: "grid", gap: "20px" }}>
        {files.map((file) => (
          <div
            key={file._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Type:</strong> {file.fileType}
            </p>

            {file.fileType === "image" ? (
              <img
                src={file.filePath}
                alt="file"
                style={{ width: "200px", borderRadius: "6px" }}
              />
            ) : (
              <a href={file.filePath} target="_blank" rel="noopener noreferrer">
                Open Document
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}