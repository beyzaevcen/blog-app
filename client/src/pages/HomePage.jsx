import { useEffect, useState } from "react";
import Post from "../Post";

export default function Homepage() {
  const [posts,setPosts]=useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/post");
        const posts = await response.json();
        setPosts(posts);
      } catch (error) {
        console.error("Error while fetching post:", error);
      }
    };
    
    fetchPosts();
  }, []);
  return (
    <div>
      <header className="blog-header">
        <h1>Whispers of the Wind</h1>
        <p className="blog-description">
        A collection of quiet reflections, poetic musings, and moments captured in time. Join me as I explore the beauty in everyday encounters and the profound insights hidden within life's gentle whispers.
        </p>
      </header>

      <div className="post-div">
      {posts.length > 0 && posts.map(post => (
  <Post key={post._id} {...post} />
))}
      </div>
    </div>
  );
}
