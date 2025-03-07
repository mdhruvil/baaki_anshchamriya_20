"use client";

import {
  ShopHeader,
  PaymentActions,
  TransactionMessage,
} from "@/components/ui/chat-comp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { api } from "@/trpc/react";

export default function ChatPage() {
  const router = useRouter();
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

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-900">
        <p>Error loading chat: {error?.message ?? "Shop not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white text-gray-900">
      <ShopHeader shop={data.shop} />
      <main className="flex flex-1 flex-col overflow-y-auto p-4">
        {data.transactions.map((transaction) => (
          <TransactionMessage key={transaction.id} transaction={transaction} />
        ))}
        <div ref={messagesEndRef} />
      </main>
      <PaymentActions upiId={data.shop.upiId} />
    </div>
  );
}
