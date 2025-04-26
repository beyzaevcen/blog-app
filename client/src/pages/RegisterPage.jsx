import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register(event) {
    event.preventDefault(); // Formun varsayılan davranışını engelle

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Eğer cookie kullanıyorsanız
      });

      if (response.status !== 200) {
        alert("registration failed");
      } else {
        alert("registration successful");
      }
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  }

  return (
    <>
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input
          type={"text"}
          placeholder="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        ></input>
        <input
          type={"password"}
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        ></input>
        <button className="login-button">Register</button>
      </form>
    </>
  );
}
