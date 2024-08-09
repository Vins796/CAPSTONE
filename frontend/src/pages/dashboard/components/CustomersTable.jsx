import { customersApi } from "../../../../api/customersApi";
import { useEffect, useState } from "react";
import defaultAvatar from '/avatar.png'

export default function CustomersTable() {

    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const response = await customersApi.getAllCustomers();
            // console.log("Dati ricevuti da getAllCustomers:", response);
            setCustomers(response);
        } catch(error) {
            console.error("Errore nella richiesta dei customers", error)
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [])

    useEffect(() => {
        // console.log("Stato customers aggiornato:", customers);
    }, [customers]);

    return (
        <div className="overflow-x-auto">
        <table className="table">
            <thead>
            <tr>
                <th>Profile</th>
                <th>Data</th>
                <th>Address</th>
                <th>Phone</th>
            </tr>
            </thead>
            <tbody>
                {customers
                    .filter(customer => customer.role === 'user')
                    .map((customer) => (
                        <tr key={customer._id}>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                            <img
                                                src={customer.image || defaultAvatar }
                                                alt="Avatar"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold space-y-1">
                                            <p>{customer.name}</p>
                                            <span className="badge badge-ghost badge-sm py-3">{customer.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {customer.name}
                                <br />
                                
                            </td>
                            <td>
                                {customer.address?.city || 'undefined'}
                            </td>
                            <th>
                                <span>{customers.phone || 'undefined'}</span>
                            </th>
                        </tr>
                    ))}
            </tbody>
        </table>
        </div>
    );
}
