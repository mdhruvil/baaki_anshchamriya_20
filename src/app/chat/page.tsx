"use client";

import Login from "@/components/Login";
import {
  PaymentActions,
  ShopHeader,
  TransactionMessage,
} from "@/components/ui/chat-comp";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function ChatPage() {
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = api.chat.getTransactionsByShopId.useQuery(
    { shopId: Number(shopId) },
    { enabled: !!shopId },
  );

  // Scroll to bottom whenever data changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-900">
        <p>Loading chat history...</p>
      </div>
    );
  }

  if (error) {
    if (error?.data?.code === "UNAUTHORIZED") {
      return <Login />;
    }
    return <div>Error: {error?.message}</div>;
  }
  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-white text-gray-900">
      <ShopHeader shop={data.shop} />
      <main className="flex flex-1 flex-col p-4">
        {data.transactions.map((transaction) => (
          <TransactionMessage key={transaction.id} transaction={transaction} />
        ))}
        <div ref={messagesEndRef} />
      </main>
      <div className="fixed bottom-0 left-0 w-full">
        <PaymentActions
          upiId={data.shop.upiId}
          totalAmount={data.transactions.reduce(
            (acc, curr) => (curr.isPaid ? acc : acc + curr.amount),
            0,
          )}
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ChatPage />
    </Suspense>
  );
}
