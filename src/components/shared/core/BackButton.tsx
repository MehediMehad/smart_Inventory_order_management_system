"use client";

import { BiArrowBack } from "react-icons/bi";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  return (
    <Button
      variant="ghost"
      onClick={() => window.history.back()}
      className="flex items-center justify-center bg-[#DCE8DF] hover:bg-[#DCE8DF]/80 rounded-full h-10 w-10"
    >
      <BiArrowBack className="h-5 w-5" />
    </Button>
  );
};

export default BackButton;
