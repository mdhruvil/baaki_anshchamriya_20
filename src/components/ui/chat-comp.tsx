import { Check, ArrowLeft, MoreVertical, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { type shops, type transactions } from "@/server/db/schema";
import { formatDate } from "date-fns";
import { Button } from "./button";

export function PaymentActions({ upiId }: { upiId: string }) {
  return (
    <div className="flex justify-center gap-4 border-t border-gray-200 p-4">
      <Button size="lg">Pay</Button>
      <Button size="lg">Request</Button>
    </div>
  );
}

type Shoptype = typeof shops.$inferSelect;
type Transactiontype = typeof transactions.$inferSelect;

export function ShopHeader({ shop }: { shop: Shoptype }) {
  return (
    <header className="flex items-center gap-3 border-b border-gray-200 p-4">
      <Link href="/" className="text-gray-900">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="flex flex-1 items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={shop.image ?? ""} />
          <AvatarFallback>{shop.name}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">{shop.name}</h1>
          <p className="text-sm text-gray-500">{shop.upiId}</p>
        </div>
      </div>

      <button className="text-gray-900">
        <MoreVertical className="h-6 w-6" />
      </button>
    </header>
  );
}

export function TransactionMessage({
  transaction,
}: {
  transaction: Transactiontype;
}) {
  return (
    <div
      className={`mb-4 max-w-[65%] rounded-[16px] bg-gray-100 p-4 text-gray-900`}
    >
      <p className="mb-2 text-3xl font-medium">₹{transaction.amount}</p>
      {transaction.notes && (
        <div className="mb-2">
          <p className="text-sm text-gray-600">{transaction.notes}</p>
        </div>
      )}

      <div className="flex items-center text-sm text-gray-600">
        {transaction.isPaid && (
          <>
            <div className="flex items-center gap-1">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span>Paid</span>
            </div>
            <span className="mx-1">•</span>
          </>
        )}
        <span>{formatDate(new Date(transaction.createdAt!), "dd MMM")}</span>
        <button className="ml-auto text-gray-900">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
