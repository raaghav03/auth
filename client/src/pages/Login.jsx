import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function loginUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://auth-backend-phi.vercel.app/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        alert("login successful");
        localStorage.setItem("token", response.data.user);
        navigate("/dashboard");
      } else {
        alert("wrong credentials");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred. Please try again later.");
    }
  }
  return (
    <>
      <h1>login</h1>
      <form onSubmit={loginUser}>
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
        <input type="submit" value="login" />
      </form>
    </>
  );
}

export default Login;
