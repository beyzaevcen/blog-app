import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [userName, setUserName] = useState(null);
  // useEffect(() => {
  //   fetch("http://localhost:4000/profile", {
  //     credentials: "include",
  //   }).then((response) => {
  //     response.json().then((userInfo) => {
  //       setUserName(userInfo.userName);
  //     });
  //   });
  // }, []);
  return (
    <header>
      <Link to="/" className="logo">
        WW
      </Link>
      <nav>
        {/* {userName && (
          <>
            <Link to="/create">Cretae new post</Link>
          </>
        )} */}
        {!userName && (
          <>
            <Link to="/create">Cretae new post</Link>
            <Link to="/login">login</Link>
            <Link to="/register">register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
