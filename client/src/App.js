import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "pages/homePage/HomePage";
import LoginPage from "pages/loginPage/LoginPage";
import ProfilePage from "pages/profilePage/ProfilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {  createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";


function App() {
  // useSelector will help us grab the value we created in our initialState.So we ever want to grab a value from store use useSelector and grab the state from correct Reducer.
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));


  return (
    <div className="app">
      <BrowserRouter>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/"/>} />
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/"/>} />
        </Routes>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
