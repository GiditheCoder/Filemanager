import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Download, Trash2 } from "lucide-react";
import FolderIcon from "../images/folder.png";
import FolderIcon2 from "../images/folder2.png";

const API_BASE = "https://textfileserver-a165358fe7c8.herokuapp.com/api/v1/file";

const TxtViewer = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  // fetch files on mount
  useEffect(() => {
    axios
      .get(API_BASE)
      .then((res) => {
        setFiles(res.data.data || []);
        if (res.data.data?.length > 0) setSelectedFile(res.data.data[0]);
      })
      .catch((err) => console.error("Error fetching files:", err));
  }, []);

  // function to handle view 
  const handleView = async (file) => {
    if (selectedFile?._id === file._id && fileContent) {
      setFileContent("");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/${file._id}`, {
        responseType: "text", // ensures plain text instead of JSON
      });
      setFileContent(res.data);
    } catch (err) {
      console.error("Error viewing file:", err);
    }
  };

  // function to handle download 
  const handleDownload = (file) => {
    window.open(`${API_BASE}/${file._id}`, "_blank");
  };

  // function to handle delete
  const handleDelete = async (file) => {
    try {
      const res = await axios.delete(`${API_BASE}/${file._id}`);
      if (res.data.success) {
        setFiles(files.filter((f) => f._id !== file._id));
        setSelectedFile(null);
        setFileContent("");
      } else {
        console.error("Failed to delete:", res.data.message);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-black drop-shadow-sm text-center sm:text-left">
        📂 File Manager
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Folders */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">
              Folders
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {["Assets", "Tutorials", "Agreements", "Videos", "Images"].map(
                (folder) => (
                  <div
                    key={folder}
                    className="bg-white p-4 rounded-xl flex flex-col items-center justify-center 
                               transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  >
                    <img
                      src={FolderIcon}
                      alt="folder"
                      className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
                    />
                    <span className="text-xs sm:text-sm font-medium">
                      {folder}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recently Added */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-700">
              Recently Added
            </h2>
            <div className="bg-white rounded-xl shadow-lg divide-y">
              {files.length === 0 ? (
                <p className="p-4 text-gray-400">No files available</p>
              ) : (
                files.map((file) => (
                  <div
                    key={file._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 transition-colors duration-200 hover:bg-indigo-50 cursor-pointer"
                    onClick={() => {
                      setSelectedFile(file);
                      setFileContent("");
                    }}
                  >
                    <span className="font-medium text-gray-800">
                      {file.filename}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                      {file.size || "—"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 space-y-6 border border-indigo-100">
          {selectedFile ? (
            <>
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">
                  File Details
                </h2>
                <img
                  src={FolderIcon2}
                  alt="folder"
                  className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 animate-pulse"
                />
              </div>

              <div>
                <p className="font-bold text-gray-800">File name</p>
                <p className="text-gray-600 break-words">{selectedFile.filename}</p>
              </div>

              <div>
                <p className="font-bold text-gray-800">Size</p>
                <p className="text-gray-600">{selectedFile.size || "Unknown"}</p>
              </div>

              <div>
                <p className="font-bold text-gray-800">Description</p>
                <p className="text-gray-600 text-sm sm:text-base">
                  A text file stores plain, readable characters such as notes,
                  lists, or simple data, usually with a .txt extension.
                </p>
              </div>

              <div>
                <p className="font-bold mb-2 text-gray-800">Actions</p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => handleView(selectedFile)}
                    className="flex items-center px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition text-sm sm:text-base"
                  >
                    <Eye className="w-4 h-4 mr-2" />{" "}
                    {fileContent ? "Hide" : "View"}
                  </button>
                  <button
                    onClick={() => handleDownload(selectedFile)}
                    className="flex items-center px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition text-sm sm:text-base"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </button>
                  <button
                    onClick={() => handleDelete(selectedFile)}
                    className="flex items-center px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition text-sm sm:text-base"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </button>
                </div>
              </div>

              {fileContent && (
                <div>
                  <p className="font-semibold mb-2 text-gray-800">Preview</p>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg max-h-60 overflow-y-auto text-xs sm:text-sm font-mono whitespace-pre-wrap border border-gray-200">
                    {fileContent}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-center mt-6 sm:mt-10">
              Select a file to see details
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TxtViewer;
