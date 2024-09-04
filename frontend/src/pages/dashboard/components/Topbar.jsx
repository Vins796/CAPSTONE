import { Bars2Icon, PlusIcon } from "@heroicons/react/24/outline"
import { useState } from "react";
import CreateProduct from "./CreateProduct";
import { productApi } from "../../../../api/productApi";
import toast, { Toaster } from 'react-hot-toast';

export default function Topbar({ onMenuButtonClick, search, handleSearch }) {

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
      // console.log('New product created:', newProduct);
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
      toast.success('Prodotto creato con successo', {
        position: window.innerWidth <= 768 ? 'bottom-center' : 'bottom-right',
      });
    } catch(error) {
      console.error('Failed to create product:', error);
    }
  }
  return (
    <>
      <Toaster
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 3000,
            },
          }}
        />
      <header className="shadow-sm">
        <div className="h-16 flex items-center justify-between px-4">
          <button className="md:hidden text-gray-500 hover:text-gray-600" onClick={onMenuButtonClick}>
            <Bars2Icon className="h-6 w-6" />
          </button>
          {/* SEARCH */}
          <div className="flex items-center flex-1 ml-4 md:ml-0">
            <input 
              type="text" 
              value={search}
              onChange={handleSearch}
              placeholder="Search" 
              className="w-full max-w-xs text-[#0f0f0f] p-2 bg-[#141414] border border-white border-opacity-[10%] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center cursor-pointer text-gray-500" onClick={() => setIsCreateProductOpen(true)}>
            {/* <button><MoonIcon className="text-gray-500 h-5 w-5"/></button> */}
            <PlusIcon className="h-5 w-5"/>
            <span className="ml-1 hidden md:block"> Nuovo prodotto</span>
            {/* <button><UserIcon className="text-gray-500 h-5 w-5"/></button> */}
          </div>
          <CreateProduct 
            isOpen={isCreateProductOpen} 
            setIsOpen={setIsCreateProductOpen} 
            onCreateProduct={handleCreateProduct}
            productData={productData}
            setProductData={setProductData}
          />
        </div>
      </header>
    </>
  )
}