import { useEffect, useState } from "react";
import { customersApi } from "../../../../api/customersApi";
import defaultAvatar from '/avatar.png'

const CustomerCard = ({ customer }) => (
  <div className="border-opacity-25 bg-[#0f0f0f] drop-shadow-lg shadow rounded-lg p-4 mb-4">
    <div className="flex items-center gap-4 mb-3">
      <img
        src={customer.image || defaultAvatar}
        alt={'Image' || defaultAvatar}
        className="w-12 h-12 rounded-full text-[#7f848b]"
      />
      <div className="text-[#dbdee0]">
        <h3 className="font-bold text-md">{customer.name}</h3>
        <p className="text-sm text-[#7f848b]">{customer.email}</p>
      </div>
    </div>
    <div className="text-sm text-[#dbdee0]">
      <p><span className="font-semibold text-sm">Address:</span> <span className="text-[#7f848b]"> {customer.address || 'N/A'}</span></p>
      <p><span className="font-semibold text-sm">Phone:</span> <span className="text-[#7f848b]"> {customer.phone || 'N/A'}</span></p>
    </div>
  </div>
);

export default function CustomersTable() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await customersApi.getAllCustomers();
        setCustomers(response.filter(customer => customer.role === 'user'));
      } catch(error) {
        console.error("Error fetching customers:", error);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (isLoading) return <div className="text-center py-4">Loading customers...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-[#141414] border border-white border-opacity-[10%] rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <CustomerCard key={customer._id} customer={customer} />
        ))}
      </div>
    </div>
  );
}
