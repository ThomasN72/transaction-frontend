"use client";

import { GET_CUSTOMERS } from "@/app/customers/queries";
import { useQuery } from "@apollo/client";
import Link from "next/link";

export default function CustomerList() {
  const { loading, error, data, refetch } = useQuery(GET_CUSTOMERS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("GraphQL error:", error);
    return <p>Error fetching customers</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Customers</h2>
      <ul>
        {data.customers.map((customer: any) => (
          <li key={customer.id} className="mt-2 flex items-center">
            <Link
              href={`/customers/${customer.id}`}
              className="text-blue-500 underline"
            >
              {customer.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
