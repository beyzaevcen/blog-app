import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import ReactQuill from "react-quill"; // Added import for ReactQuill

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);
  const [error, setError] = useState(''); // Added error state

  // ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    fetch('http://localhost:4000/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      })
      .catch(err => {
        setError('Failed to load post data');
        console.error(err);
      });
  }, [id]); // Added id to dependency array

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    try {
      const response = await fetch('http://localhost:4000/post', {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });
      if (response.ok) {
        setRedirect(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update post');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form className="post-form" onSubmit={updatePost}>
      <h1>✨ Edit Your Post</h1>
      
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
      
      <button className="post-button">Update post</button>
    </form>
  );
}