import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function registerUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        username,
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <h1>register</h1>
      <form onSubmit={registerUser}>
        <input
          type="text"
          placeholder="name"
          value={username}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input type="submit" value="register" />
      </form>
    </>
  );
}

export default App;
