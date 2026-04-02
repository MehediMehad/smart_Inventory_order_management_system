"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

type TVideoUploader = {
  label?: string;
  className?: string;
  setVideoFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setVideoPreview: React.Dispatch<React.SetStateAction<string[]>>;
};

const UserVideoUploader = ({
  label = "Upload Exercise Video",
  className,
  setVideoFiles,
  setVideoPreview,
}: TVideoUploader) => {
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate video file
    if (!file.type.startsWith("video/")) {
      alert("Please upload a valid video file");
      return;
    }

    setVideoFiles([file]);

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreview([reader.result as string]);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  return (
    <div
      className={cn("flex flex-col items-center relative w-full", className)}
    >
      <Input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoChange}
      />
      <label
        htmlFor="video-upload"
        className="w-full h-[27rem] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition text-center"
      >
        <Upload className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-1">MP4, MOV, WebM (Max 100MB)</p>
      </label>
    </div>
  );
};

export default UserVideoUploader;
