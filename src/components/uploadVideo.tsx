"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface VideoHistoryItem {
  title: string;
  size: string;
  duration: string;
  url: string;
}

const UploadVideo = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoInfo, setVideoInfo] = useState({
    title: "",
    size: "",
    duration: "",
  });
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (!file.type.startsWith("video/")) return;

    setIsUploading(true);
    setUploadProgress(0);

    const simulateUpload = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(simulateUpload);
          setTimeout(() => processVideo(file), 300);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const processVideo = (file: File) => {
    const videoURL = URL.createObjectURL(file);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const tempVideo = document.createElement("video");
    tempVideo.src = videoURL;

    tempVideo.onloadedmetadata = () => {
      const duration = tempVideo.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const durationStr = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      const title = file.name.replace(/\.[^/.]+$/, "");

      setVideoSrc(videoURL);
      setVideoInfo({ title, size: sizeMB, duration: durationStr });

      setHistory((prev) => {
        const updated = [
          { title, size: sizeMB, duration: durationStr, url: videoURL },
          ...prev,
        ];
        return updated.slice(0, 5); // max 5 items
      });

      setIsUploading(false);
    };
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
  };

  async function updateValues(max1: number, max2: number, max3: number) {
    try {
      const resp = await axios.get(
        "https://aloftballoon.pythonanywhere.com/api/value",
        { params: { max1, max2, max3 } },
      );
      console.log("API replied:", resp.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error calling API:", err.message);
      } else {
        console.error("Error calling API:", err);
      }
    }
  }

  useEffect(() => {
    const video = videoPlayerRef.current;
    const canvas = canvasRef.current;
    let frameCount = 0;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    function streamVideoFrame() {
      // 2. Draw the current video frame onto the hidden canvas
      if (video && canvas && context) {
        frameCount++;
        if (frameCount % 5 == 0) {
          frameCount = 1;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Send the frame data to the Flask server
          // Use the Fetch API to send a POST request to the Flask server
          // Ensure the server is running and the endpoint is correct
          // --- 3. Extract Pixel Data and Calculate Average RGB ---
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          const pixels = imageData.data;
          let totalRed = 0;
          let totalGreen = 0;
          let totalBlue = 0;
          const numPixels = pixels.length / 4; // Each pixel has RGBA

          for (let i = 0; i < pixels.length; i += 4) {
            totalRed += pixels[i]; // Red component
            totalGreen += pixels[i + 1]; // Green component
            totalBlue += pixels[i + 2]; // Blue component
            // Alpha component (pixels[i + 3]) is ignored for average color
          }

          const avgRed = totalRed / numPixels;
          const avgGreen = totalGreen / numPixels;
          const avgBlue = totalBlue / numPixels;

          updateValues(avgRed, avgGreen, avgBlue);
        }
      }
      video?.requestVideoFrameCallback(streamVideoFrame);
    }

    video.requestVideoFrameCallback(streamVideoFrame);
  }, [videoSrc]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl justify-center">
      <header className="w-2/3 justify-self-center mb-10 text-center bg-red-100 rounded-4xl shadow-md p-6">
        <h1 className="text-4xl font-bold text- mb-2 text-goose-red-419">
          Video Uploader
        </h1>
        <p className="text-goose-red-419">
          Upload your videos and watch them instantly
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-md mb-10 transition-all hover:shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Upload Your Video
          </h2>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 hover:border-red-400 bg-white hover:bg-red-100 rounded-lg p-8 text-center cursor-pointer mb-4"
          >
            <div className="flex flex-col items-center justify-center">
              <i className="fas fa-cloud-upload-alt text-5xl text-red-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag & drop your video here
              </p>
              <p className="text-gray-500 mb-4">or</p>
              <label
                htmlFor="video-upload"
                className="bg-red-400 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md cursor-pointer transition-colors"
              >
                Browse Files
              </label>
              <input
                type="file"
                id="video-upload"
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          {isUploading && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{videoInfo.title || "Uploading..."}</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {videoSrc && (
        <div className="bg-white rounded-xl shadow-md mb-10">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Video
            </h2>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoPlayerRef}
                controls
                className="w-full h-full"
                src={videoSrc}
              ></video>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  {videoInfo.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Size: {videoInfo.size} MB • Duration: {videoInfo.duration}
                </p>
              </div>
              <a
                href={videoSrc}
                download={`${videoInfo.title}.mp4`}
                className="bg-red-400 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                <i className="fas fa-download mr-2" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Uploads
            </h2>
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => {
                    setVideoSrc(item.url);
                    setVideoInfo({
                      title: item.title,
                      size: item.size,
                      duration: item.duration,
                    });
                    videoPlayerRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <i className="fas fa-video text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.size} MB • {item.duration}
                      </p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <i className="fas fa-play" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default UploadVideo;
