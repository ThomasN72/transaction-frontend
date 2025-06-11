"use client";

import { GET_CUSTOMERS } from "@/app/customers/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function CustomerList() {
  const { loading, error, data } = useQuery(GET_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!data?.customers) return [];
    return data.customers.filter((c: any) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error)
    return (
      <p className="text-center py-8 text-red-500">Error fetching customers</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold">Customers</h2>
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-4 text-indigo-600 sm:mt-0 w-full sm:w-64 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCustomers.map((customer: any) => (
          <div
            key={customer.id}
            className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow"
          >
            <Link
              href={`/customers/${customer.id}`}
              className="text-xl font-semibold text-indigo-600 hover:underline"
            >
              {customer.name}
            </Link>
            <p className="mt-2 text-gray-600">
              Total Revenue:{" "}
              <span className="font-medium">${customer.amount}</span>
            </p>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <p className="text-center text-gray-600">No customers found.</p>
      )}
    </div>
  );
}
