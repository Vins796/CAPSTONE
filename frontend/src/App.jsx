// REACT ROUTER DOM
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import Home from "./pages/Home";
import Products from "./pages/Products";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/404";

// CART CONTEXT
import { CartProvider } from "./context/CartContext";


export default function App() {

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>
      </Router>
    </CartProvider>
  )
}

