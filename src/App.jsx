import { useState } from "react";

function App() {
  //State to hold selected file object
  const [selectedFile, setSelectedFile] = useState(null);

  //State to display the name of the selected file
  const [fileName, setFileName] = useState("Choose File");

  //State to manage messages displayed to the user
  const [message, setMessage] = useState({ text: "", type: "hidden" });

  /**
   * Handles the change event when a file is selected using the input.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setMessage({ text: "", type: "hidden" }); //Clear messages on new file selection
    } else {
      setSelectedFile(null);
      setFileName("Choose File");
    }
  };

  /**
   * Handles the for submission for uploading the image.
   * Sends a POST request to the flask backend with the image data.
   */
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      showMessage("Please selecte a file to upload.", "error");
      return;
    }

    //Create a formData object to send the file
    const formData = new FormData();
    formData.append("file", selectedFile);

    showMessage("Uploading image...", "info");

    try {
      const response = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message, "success");
        setSelectedFile(null);
        setFileName("Choose File");
      } else {
        showMessage(`Error: ${data.error || "Unknown error"}`, "error");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      showMessage(`Upload failed: ${error.message}`, "error");
    }
  };

  const showMessage = (msg, type = "info") => {
    setMessage({ text: msg, type: type });
  };

  return (
    // Enhanced background with a subtle radial gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      {/* Enhanced container styling with stronger shadow and border */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-sm text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 drop-shadow-sm">
          Image Upload
        </h1>

        <form onSubmit={handleUpload} className="space-y-7">
          {/* Custom file input styling with gradient button */}
          <div className="relative overflow-hidden inline-block w-full cursor-pointer">
            <input
              type="file"
              id="imageFile"
              name="file"
              accept="image/*"
              className="absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full"
              onChange={handleFileChange}
            />
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span id="fileNameDisplay">{fileName}</span>
            </div>
          </div>

          {/* Upload button with gradient and stronger shadow */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-8 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Upload Image
          </button>
        </form>

        {/* Message display area */}
        <div
          id="messageBox"
          className={`mt-8 p-5 rounded-lg text-sm transition-all duration-300 ease-in-out ${
            message.type === "hidden" ? "hidden" : ""
          } ${
            message.type === "info"
              ? "bg-blue-100 text-blue-700 border border-blue-200"
              : message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-200"
              : ""
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

export default App;
