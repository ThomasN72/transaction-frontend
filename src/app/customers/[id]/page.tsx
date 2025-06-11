"use client";

import { CREATE_TRANSACTION, GET_TRANSACTIONS } from "@/app/customers/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
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
  const [createTransaction] = useMutation(CREATE_TRANSACTION);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);
  const { id } = useParams();
  const customerId = Number(id);

  const [transactionData, setTransactionData] = useState<any[]>([]);
  const [amount, setAmount] = useState<any[]>([]);
  // Create a single Socket.IO connection
  const socket = useMemo(() => io("http://localhost:3001"), []);

  // Historical queries for each metric
  const {
    loading: transactionLoading,
    error: transactionError,
    data: transactionQueryData,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { customerId },
    skip: !customerId,
  });

  // Process historical CPU data
  useEffect(() => {
    if (transactionQueryData) {
      console.log("Transaction Query Data:", transactionQueryData);
      setTransactionData(
        transactionQueryData.transactions.map((entry: any) => ({
          date: new Date(entry.date).toLocaleTimeString(),
          amount: entry.amount,
        }))
      );
    }
  }, [transactionQueryData]);

  // Socket subscriptions for dynamic updates
  // useEffect(() => {
  //   if (!customerId) return;

  //   // Subscribe once
  //   socket.emit("subscribe", { customerId });

  //   // CPU updates
  //   socket.on("cpuUpdate", (newData: any) => {
  //     console.log("cpuUpdate", newData);
  //     setCpuData((prev) => [
  //       ...prev.slice(-30),
  //       {
  //         time: new Date(newData.timestamp || Date.now()).toLocaleTimeString(),
  //         usage: newData.usagePercentage,
  //       },
  //     ]);
  //   });

  //   return () => {
  //     socket.off("cpuUpdate");
  //     socket.disconnect();
  //   };
  // }, [instanceId]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    // try {
    //   await createTransaction({
    //     variables: { input: { name, ip } },
    //   });
    //   setName("");
    //   setIp("");
    //   refetch(); // Re-fetch the list of instances to update the UI
    // } catch (err) {
    //   console.error("Error creating instance:", err);
    // }
  };

  if (transactionLoading) return <p>Loading...</p>;
  if (transactionError) return <p>Error loading data</p>;

  // Colors for the disk pie chart
  const pieColors = ["#8884d8", "#82ca9d"];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Customer {id} Metrics</h2>
      <h3 className="mt-8 text-xl font-semibold">Create New Transaction</h3>
      <form
        onSubmit={handleCreateTransaction}
        className="mt-4 flex flex-col max-w-md"
      >
        <input
          type="text"
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mb-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          Create Transaction
        </button>
      </form>
      {/* CPU Usage Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactionData}>
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
