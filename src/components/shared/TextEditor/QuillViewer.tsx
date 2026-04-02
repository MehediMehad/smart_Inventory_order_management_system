"use client";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface QuillViewerProps {
  value: string;
}

const QuillViewer = ({ value }: QuillViewerProps) => {
  return (
    <ReactQuill
      value={value}
      readOnly
      theme="bubble"
      className="quill-viewer-mode"
    />
  );
};

export default QuillViewer;
