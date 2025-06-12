"use client";

import { CREATE_TRANSACTION, GET_TRANSACTIONS } from "@/app/customers/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import io from "socket.io-client";

export default function TransactionPage() {
  const { id } = useParams();
  const customerId = Number(id);
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS, {
    variables: { customerId },
    skip: !customerId,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const socket = useMemo(() => io("http://localhost:3001"), []);
  useEffect(() => {
    socket.on("transactionCreated", (txn: any) => {
      if (txn.customer.id === customerId) {
        setTransactions((prev) => [...prev, txn]);
      }
    });
    return () => {
      socket.off("transactionCreated");
      socket.disconnect();
    };
  }, [socket, customerId]);

  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => refetch(),
  });

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  useMemo(() => {
    setTransactions(
      data?.transactions.map((tx: any) => ({
        time: new Date(tx.date).toLocaleDateString(),
        amount: tx.amount,
      }))
    );
  }, [data]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("USD");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTransaction({
      variables: { input: { name, amount, currency, customerId } },
    });
    setName("");
    setAmount(0);
    setCurrency("USD");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center p-6">Error loading data</div>
    );

  const customerName = data?.transactions[0]?.customer?.name || "Customer";
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <button
          onClick={() => router.push("/customers")}
          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
        >
          ← Back
        </button>{" "}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {customerName} Metrics
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              New Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Purchase"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 123.45"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow transition"
              >
                Add Transaction
              </button>
            </form>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Transactions Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transactions}>
                <XAxis dataKey="time" tick={{ fill: "#4B5563" }} />
                <YAxis domain={[0, "dataMax"]} tick={{ fill: "#4B5563" }} />
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-12 mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            All Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.transactions?.map((tx, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                      {tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {tx.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
