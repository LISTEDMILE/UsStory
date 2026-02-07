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
import Footer from "./compo/footer";
import Header from "./compo/header";
import Creations from "./creator/creations";
import AboutUs from "./general/aboutUs";
import Help from "./general/help";
import Contact from "./general/contactUs";


function Layout() {
  return (
    <>
      <Header/>
      <Outlet />
     <Footer/>
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
      element: <Layout/>,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/aboutUs", element: <AboutUs /> },
        { path: "/help", element: <Help /> },
        { path: "/contactUs", element: <Contact /> },
        { path: "/auth/signUp", element: <SignUp /> },
        { path: "/auth/login", element: <Login /> },
        { path: "/creator/create/:creationId", element: <CreateCreation /> },
        { path: "/creator/create", element: <CreateCreation /> },
        { path: "/creator/creation/:creationId", element: <SeeCreation /> },
        
        { path: "/creator/creations", element: <Creations /> },
         
      ],
    },
  ]);

  return <RouterProvider router={route}></RouterProvider>;
}

export default App;