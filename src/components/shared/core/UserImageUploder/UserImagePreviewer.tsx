"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type TImagePreviewer = {
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreview: string[];
  setImagePreview: React.Dispatch<React.SetStateAction<string[]>>;
  existingImage?: string;
  setExistingImage?: React.Dispatch<React.SetStateAction<string | null>>;
};

const UserImagePreviewer = ({
  setImageFiles,
  imagePreview,
  setImagePreview,
  existingImage,
  setExistingImage,
}: TImagePreviewer) => {
  const handleRemove = () => {
    setImageFiles([]);
    setImagePreview([]);

    if (existingImage) {
      if (setExistingImage) {
        setExistingImage("");
      }
    }
  };

  // Show existing image if no new preview is available
  const displayImage =
    imagePreview.length > 0 ? imagePreview[0] : existingImage;

  if (!displayImage) return null;

  return (
    <div className="relative h-[27rem] w-full mx-auto rounded-md overflow-hidden border border-dashed border-gray-300">
      <Image
        width={800}
        height={400}
        src={displayImage}
        alt="Meal Preview"
        className="object-cover w-full h-full"
        priority
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

export default UserImagePreviewer;
