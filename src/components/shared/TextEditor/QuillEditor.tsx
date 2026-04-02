"use client";

import React, { forwardRef, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const QuillEditor = forwardRef<ReactQuill, QuillEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const quillRef = useRef<ReactQuill>(null);

    const modules = {
      toolbar: [
        [{ font: [] }, { size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link"],
        // ["blockquote", "clean"],
        // [{ direction: "rtl" }],
      ],
      clipboard: {
        matchVisual: false,
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    };

    const formats = [
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "script",
      "header",
      "align",
      "list",
      "indent",
      "link",
    ];

    return (
      <div className="rounded-quill-container">
        <ReactQuill
          ref={(node) => {
            if (node) {
              quillRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }
          }}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ marginBottom: "40px" }}
          className={`[&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl ${className}`}
        />
      </div>
    );
  },
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
