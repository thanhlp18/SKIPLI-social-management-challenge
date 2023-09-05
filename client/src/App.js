import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import NavbarDashboard from "./containers/Dashboard/components/Navbar/Navbar";
import PostList from "./containers/Dashboard/components/PostList";
import Dashboard from "./containers/Dashboard/Dashboard";
import SignIn from "./containers/SignIn";
import AccountList from "./containers/Dashboard/components/AccountList";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: <PostList />,
      },
      {
        path: "/accounts",
        element: <AccountList />,
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
