export default function ConfirmationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-[#0f0f0f] rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-[#dadada] mb-4">Ordine Confermato!</h2>
        <p className="text-[#dadada] mb-6">Il tuo ordine è stato inviato con successo. Grazie per il tuo acquisto!</p>
        <button
          onClick={onClose}
          className="w-full bg-green-500 text-[#dadada] font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-200"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};
