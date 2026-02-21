import { useEffect, useState } from "react";
import axios from "axios";

interface FileType {
  _id: string;
  fileType: string;
  filePath: string;
  createdAt: string;
}

export default function AllFiles() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("/api/files");
        setFiles(res.data.files);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

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
              borderRadius: "8px"
            }}
          >
            <p><strong>Type:</strong> {file.fileType}</p>

            {file.fileType === "image" ? (
              <img
                src={`/api/files/render/${file._id}`}
                alt="file"
                style={{ width: "200px", borderRadius: "6px" }}
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
        ))}
      </div>
    </div>
  );
}