import React, { useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../store";
import { apiFetch } from "./api/api";
import SignUp from "./auth/signUp";
import Login from "./auth/login";
import LandingPage from "./general/LandingPage";
import "./App.css";
import CreateCreation from "./creator/createCreations";
import SeeCreation from "./creator/seeCreation";


function Layout() {
  return (
    <>
      {/* <Header /> */}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAboutLogin = async () => {
      try {
        const data = await apiFetch("/auth/me", {
                method: "POST",
               
              });
        if (data.isLoggedIn) {
          dispatch(
            userActions.Login({
              _id: data._id,
            }),
          );
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchAboutLogin();
  }, []);

  const route = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/auth/signUp", element: <SignUp /> },
        { path: "/auth/login", element: <Login /> },
        { path: "/creator/create", element: <CreateCreation /> },
        {path:"/creator/creation/:creationId", element:<SeeCreation/>},
       
      ],
    },
  ]);

  return <RouterProvider router={route}></RouterProvider>;
}

export default App;