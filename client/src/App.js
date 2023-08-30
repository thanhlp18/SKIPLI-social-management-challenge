import { useNavigate } from "react-router-dom";
import "./App.css";
import SignIn from "./containers/SignIn";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  });
  return <></>;
}

export default App;
