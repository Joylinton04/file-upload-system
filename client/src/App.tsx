import { ArrowUp, File } from "lucide-react";
import React, { useContext, useState, type ChangeEvent } from "react";
import { AppContent } from "./context/AppContext";
import { useAppContext } from "./hook/useAppContext";

const App = () => {
  const context = useContext(AppContent);
  if (!context) {
    return <p>Loading...</p>;
  }
  const { file, setFile } = context;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const metaList = Array.from(file).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFile(metaList);
  };

  const handleFileUpload = () => {
    console.log("uploaded");
  };
  const handleFileRemove = () => {
    console.log("File Removed");
  };

  return (
    <div className="min-h-screen w-full font-default py-10">
      {/* Header */}
      <div className="w-full border bg-black text-white fixed top-0 left-0 right-0 z-10 flex items-center justify-center p-6 font-bold">
        <p>Upload images here!</p>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center mt-20 px-4">
        <form className="w-full max-w-2xl" encType="multipart/form-data">
          {/* Upload Area */}
          <div className="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-md p-6 h-40 relative cursor-pointer bg-white hover:bg-gray-50 transition">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              multiple
              name="file"
              onChange={handleChange}
            />
            <div className="text-center text-gray-500 pointer-events-none flex flex-col items-center">
              <div className="relative">
                <File size={50} />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 bg-blue-600 rounded-full grid place-content-center h-7 w-7">
                  <ArrowUp size={20} strokeWidth={3} className="text-white" />
                </div>
              </div>
              <p className="text-xs mt-4">
                Click or drag file to this area to upload
              </p>
              <p className="text-xs">Supported formats: .jpeg, .jpg, .png</p>
            </div>
          </div>
        </form>

        {/* Uploaded Files Section */}
        {file.length > 0 && (
          <h1 className="mt-10 w-full max-w-2xl font-semibold text-lg mb-2">
            Your files
          </h1>
        )}
        <div className="w-full max-w-2xl max-h-[30rem] overflow-y-scroll">
          {file.length > 0 &&
            Array.from(file).map((fi, index) => (
              <div
                key={index}
                className="shadow-md relative flex gap-4 items-center border rounded-xl p-4 bg-white mt-4"
              >
                {/* Image Preview */}
                <img
                  src={""}
                  alt={fi.name}
                  className="h-20 w-20 rounded-lg object-cover shadow-sm border"
                />

                {/* File Details */}
                <div className="flex flex-col flex-1 overflow-hidden">
                  <h3 className="text-sm font-medium truncate">{fi.name}</h3>
                  <p className="text-xs text-gray-500">
                    {(fi.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleFileUpload}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded transition"
                  >
                    Upload
                  </button>
                  <button
                    onClick={handleFileRemove}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
