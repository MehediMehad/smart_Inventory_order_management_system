"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type TVideoPreviewer = {
  videoPreview: string[];
  setVideoFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setVideoPreview: React.Dispatch<React.SetStateAction<string[]>>;
};

const UserVideoPreviewer = ({
  videoPreview,
  setVideoFiles,
  setVideoPreview,
}: TVideoPreviewer) => {
  const handleRemove = () => {
    setVideoFiles([]);
    setVideoPreview([]);
  };

  if (videoPreview.length === 0) return null;

  return (
    <div className="relative w-full mx-auto rounded-md overflow-hidden border border-dashed border-gray-300 bg-black">
      <video
        src={videoPreview[0]}
        controls
        className="w-full h-[27rem] object-contain"
      />
      <Button
        type="button"
        size="sm"
        onClick={handleRemove}
        className="bg-red-500 hover:bg-red-600 absolute top-3 right-3 w-8 h-8 p-0 rounded-full"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserVideoPreviewer;
