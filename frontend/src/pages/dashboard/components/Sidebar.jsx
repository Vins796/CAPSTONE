import { Link } from "react-router-dom";
import { HomeIcon, ShoppingBagIcon, UserIcon, ChartBarIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import logo from '/image.png'
import { useAuth0 } from "@auth0/auth0-react";
import { TbLogout } from "react-icons/tb";

export default function Sidebar({ isOpen, toggleSidebar }) {

  const { logout } = useAuth0();

  // Gestisce il logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transform fixed md:relative inset-y-0 left-0 z-30 w-64 bg-[#0f0f0f] shadow-lg overflow-y-auto transition duration-300 ease-in-out`}>
      <div className="flex items-center justify-between h-16 shadow-sm px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <span className="md:text-xl">Il Forno Di Agostini</span>
        </Link>
        <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-600">
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-5 px-4">
        <Link to="/" className="group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-[#7f848b] hover:bg-gray-50 hover:text-gray-900 transition ease-in-out duration-150">
          <HomeIcon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
          Home
        </Link>
        <Link to="/products" className="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-[#7f848b] hover:bg-gray-50 hover:text-gray-900 transition ease-in-out duration-150">
          <ShoppingBagIcon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
          Products
        </Link>
        <button onClick={handleLogout} className="mt-1 group flex items-center gap-4 px-2 py-2 text-base leading-6 font-medium rounded-md text-[#7f848b] hover:bg-gray-50 hover:text-gray-900 transition ease-in-out duration-150">
          <TbLogout className="size-6"/> Logout
        </button>
      </nav>
    </div>
  );
}