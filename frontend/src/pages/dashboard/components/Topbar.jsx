import { MoonIcon, UserIcon, MagnifyingGlassIcon, Bars2Icon, PlusIcon } from "@heroicons/react/24/outline"
import { useState } from "react";
import CreateProduct from "./CreateProduct";
import { productApi } from "../../../../api/productApi";

export default function Topbar({ onMenuButtonClick }) {

  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false); // Stato per gestire l'apertura della modale
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
        <CreateProduct 
          isOpen={isCreateProductOpen} 
          setIsOpen={setIsCreateProductOpen} 
          onCreateProduct={async (productData) => {
            try {
              const newProduct = await productApi.createProduct(productData);
              console.log('New product created:', newProduct);
              // Aggiungi qui la logica per aggiornare l'UI o notificare l'utente del successo
            } catch (error) {
              if (error.message === 'User not authenticated' || error.message === 'Session expired or unauthorized') {
                alert('Sessione scaduta o non autorizzato. Effettua nuovamente il login.');
                // Qui dovresti reindirizzare l'utente alla pagina di login o refreshare il token
              } else {
                alert('Errore durante la creazione del prodotto. Riprova più tardi.');
              }
              console.error('Failed to create product:', error);
            }
          }}
        />
      </div>
    </header>
  )
}