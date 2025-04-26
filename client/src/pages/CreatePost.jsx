import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

export default function PostPage() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  
  async function createPost(event) {
    event.preventDefault();
    setError("");
    
    if (!title || !summary || !content) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (!files || files.length === 0) {
      setError("Please select an image.");
      return;
    }
    
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    
    try {
      const response = await fetch("http://localhost:4000/post", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      
      if (response.ok) {
        setRedirect(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred while creating the post.");
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setError("An error occurred while connecting to the server.");
    }
  }
  
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  
  return (
    <form className="post-form" onSubmit={createPost}>
      <h1>✨ Make Magic With Words</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      
      <input type="file" onChange={(event) => setFiles(event.target.files)} />
      
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="Write your content here..."
      />
      
      <button className="post-button">Create post</button>
    </form>
  );
}