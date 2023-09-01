import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import NavbarDashboard from "./containers/Dashboard/components/Navbar";
import PostList from "./containers/Dashboard/components/PostList";
import Dashboard from "./containers/Dashboard/Dashboard";
import SignIn from "./containers/SignIn";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/postlist",
        element: <PostList />,
      },
      {
        path: "/account",
        element: <NavbarDashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <SignIn />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
