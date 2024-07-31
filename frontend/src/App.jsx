// REACT ROUTER DOM
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import Home from "./pages/Home";

// COMPONENTS
import About from "./pages/About";
import Products from "./pages/Products";
import UserProfile from "./pages/UserProfile";


export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
      </Routes>
    </Router>
  )
}

