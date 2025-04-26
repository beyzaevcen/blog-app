import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id,title, summary, cover, content, createdAt}) {
  return (
    <div className="post">
      <div className="post-image">
        <Link to={`post/${_id}`}>
        <img src={'http://localhost:4000/'+cover} />
        </Link>
       
      </div>

      <div className="texts">
        <Link to={`post/${_id}`}>
        <h2>{title}</h2>

        </Link>
        <p className="info">
          <a className="author">beyza</a>
          <time>{format(new Date(createdAt), "yyyy-MM-dd")}</time>
        </p>
        <p className="summary">
          {summary}
        </p>
      </div>
    </div>
  );
}