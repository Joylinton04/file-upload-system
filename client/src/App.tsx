import { ArrowUp, File, Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import React, {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import { AppContent } from "./context/AppContext";
import fileToBase64 from "./utils/fileToBase64";
import axios from "axios";

interface FileDataType {
  _id: string;
  name: string;
  size: number;
  fileUrl: string;
}

const App = () => {
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<FileDataType[]>([]);
  const context = useContext(AppContent);
  if (!context) {
    return <p>Loading...</p>;
  }
  const { file, setFile, handleStatus, setHandleStatus } = context;

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const validFiles = Array.from(files).filter((file) => {
      const isValid = allowedTypes.includes(file.type);
      if (!isValid) {
        toast.error(`${file.name} is not a supported file format.`);
      }
      return isValid;
    });

    if (validFiles.length === 0) return;

    const metaList = await Promise.all(
      validFiles.map(async (f) => ({
        id: uuidv4(),
        name: f.name,
        size: f.size,
        type: f.type,
        base64: await fileToBase64(f),
      }))
    );

    setFile((prev) => [...(prev || []), ...metaList]);
    setHandleStatus('local')
  };

  const handleFileUpload = async (id: string) => {
    const selectedFile = file.find((fi) => fi.id === id);
    if (!selectedFile) return;

    const blob = await fetch(selectedFile.base64)
      .then((res) => res.blob())
      .catch((err) => {
        console.error("Error fetching blob:", err);
        return null;
      });

    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, selectedFile.name);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (ProgressEvent) => {
            const totalUpload = ProgressEvent?.total;
            if (totalUpload) {
              const percentageProgress = Math.round(
                (ProgressEvent.loaded * 100) / totalUpload
              );
              setProgress(percentageProgress);
            }
          },
        }
      );
      if (response.data?.success) {
        toast.success(response.data.message || "Upload successful");
      } else {
        toast.error("Upload failed");
      }

      setProgress(0);
    } catch (err) {
      setProgress(0);
      console.error("FormData upload failed:", err);
    }
  };

  const handleFileRemove = (id: string) => {
    setFile((prev) => prev.filter((file) => file.id !== id));
  };

  const getUploadedFiles = async () => {
    try {
      const reponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/files-uploaded`
      );
      setUploadedFiles(reponse.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUploadedFiles();
  }, [handleStatus]);

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(link)
  };

  const handleDeleteFile = async (id: string) => {
    try{
      const {data} = await axios.delete(`${import.meta.env.VITE_API_URL}/files-uploaded/${id}`)
      if(data.success){
        toast.success('File deleted successfully')
      }
      else {
        toast.error(data.message)
      }
    }catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen w-full font-default py-10">
      <ToastContainer />
      {/* Header */}
      <div className="w-full border bg-black text-white fixed top-0 left-0 right-0 z-10 flex items-center justify-center p-6 font-bold">
        <p>
          Save you images on this server at zero cost and retrieve it anytime!
        </p>
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
          <div className="mt-10 w-full max-w-2xl mb-2 flex justify-between items-center">
            <h1
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => setHandleStatus("local")}
            >
              Your files
            </h1>
            <div
              className="font-semibold cursor-pointer underline"
              onClick={() => setHandleStatus("uploaded")}
            >
              View uploaded files
            </div>
          </div>
        )}

        {handleStatus === "local" ? (
          <div className="w-full max-w-2xl max-h-[30rem] overflow-y-scroll">
            {file.length > 0 &&
              Array.from(file).map((fi, index) => (
                <div
                  key={index}
                  className="shadow-md relative flex gap-4 items-center border rounded-xl p-4 bg-white mt-4"
                >
                  {/* Image Preview */}
                  <img
                    src={fi.base64}
                    alt={""}
                    className="h-20 w-20 rounded-lg object-cover shadow-sm border"
                  />

                  <div
                    className="absolute top-0 left-0 rounded-xl w-full h-2"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="bg-blue-600 h-full rounded-xl"></div>
                  </div>

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
                      onClick={() => handleFileUpload(fi.id)}
                      className={`bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded transition ${
                        !!progress ? "opacity-5" : 0
                      }`}
                      disabled={!!progress}
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => handleFileRemove(fi.id)}
                      className={`bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded transition ${
                        !!progress ? "opacity-5" : 0
                      }`}
                      disabled={!!progress}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="w-full max-w-2xl max-h-[30rem] overflow-y-scroll">
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((fi, index) => (
                <div
                  key={index}
                  className="shadow-md relative flex gap-4 items-center border rounded-xl p-4 bg-white mt-4"
                >
                  {/* Image Preview */}
                  <img
                    src={fi.fileUrl}
                    alt={""}
                    className="h-20 w-20 rounded-lg object-cover shadow-sm border"
                  />

                  {/* File Details */}
                  <a
                    className="flex flex-col flex-1 overflow-hidden"
                    href={fi.fileUrl}
                  >
                    <h3 className="text-sm font-medium truncate">{fi.name}</h3>
                    <p className="text-xs text-gray-500">
                      {(fi.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </a>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleFileDownload(fi.fileUrl, fi.name)}
                      className={`bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded transition`}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteFile(fi._id)}
                      className={`bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded transition}`}>
                      Delete Image
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="text-center text-red-500">No Files Uploaded</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
