import { useState } from "react";
import axios from "axios";

function App() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function registerUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://auth-backend-phi.vercel.app/auth/register",
        {
          username,
          email,
          password,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="p-12">
        <h1>register</h1>
        <form onSubmit={registerUser} className="flex flex-col gap-4 ">
          <input
            type="text"
            placeholder="name"
            value={username}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
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
      </div>
    </>
  );
}

export default App;
