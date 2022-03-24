import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/register/register";
import Home from "./Pages/home/home";
import Login from "./Pages/login/login";
import Layout from "./components/Layout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./context/auth";
import Post from "./Pages/post/post";
import { Colors } from "./utils/theme";
const theme = createTheme({
  typography: {
    fontFamily: `'Roboto', sans-serif`,
    a: {
      fontFamily: "'Creepster', cursive",
    },
  },
  palette: {
    primary: {
      main: Colors.primary,
    },
    secondary: {
      main: Colors.secondary,
    },
    text: {
      primary: Colors.text.primary,
    },
  },
});
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <Layout>
              <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={"register"} element={<Register />} />
                <Route exact path={"/login"} element={<Login />} />
                <Route path="post/:postId" element={<Post />} />
                <Route path="post/:postId/:cmd" element={<Post />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
