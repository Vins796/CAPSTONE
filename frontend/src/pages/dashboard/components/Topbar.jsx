import { MoonIcon, UserIcon, MagnifyingGlassIcon, Bars2Icon, PlusIcon } from "@heroicons/react/24/outline"
import { useState } from "react";
import CreateProduct from "./CreateProduct";
import { productApi } from "../../../../api/productApi";
import ConfirmAlert from "./ConfirmAlert";

export default function Topbar({ onMenuButtonClick }) {

  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false); // Stato per gestire l'apertura della modale
  const [showAlert, setShowAlert] = useState(false); // Stato per mostrare l'alert di avvenuta creazione del prodotto

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });

  const handleCreateProduct = async() => {
    try {
      const newProduct = await productApi.createProduct(productData);
      console.log('New product created:', newProduct);
      setIsCreateProductOpen(false);
      setShowAlert(true);
      // Nascondo l'alert dopo alcuni secondi
      setTimeout(() => setShowAlert(false), 3000);
      // Resetta i dati del prodotto dopo la creazione
      setProductData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null
      });
    } catch(error) {
      console.error('Failed to create product:', error);
    }
  }
  return (
    <header className="shadow-sm">
      <div className="h-16 flex items-center justify-between px-4">
        <button className="md:hidden text-gray-500 hover:text-gray-600" onClick={onMenuButtonClick}>
          <Bars2Icon className="h-6 w-6" />
        </button>
        {/* SEARCH */}
        <div className="flex items-center flex-1 ml-4 md:ml-0">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full max-w-xs p-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" className="ml-2">
            <MagnifyingGlassIcon className="text-gray-500 h-5 w-5 hidden md:block"/>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button><MoonIcon className="text-gray-500 h-5 w-5"/></button>
          <button onClick={() => setIsCreateProductOpen(true)}><PlusIcon className="text-gray-500 h-5 w-5"/></button>
          <button><UserIcon className="text-gray-500 h-5 w-5"/></button>
        </div>
        {showAlert && <ConfirmAlert />}
        <CreateProduct 
          isOpen={isCreateProductOpen} 
          setIsOpen={setIsCreateProductOpen} 
          onCreateProduct={handleCreateProduct}
          productData={productData}
          setProductData={setProductData}
        />
      </div>
    </header>
  )
}