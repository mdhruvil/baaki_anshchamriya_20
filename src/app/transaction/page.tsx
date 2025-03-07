"use client";
import { api } from "@/trpc/react";
import { formatDate } from "date-fns";
import { Check, Hourglass } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentReceipt() {
  const searchParams = useSearchParams();

  const { data, isLoading, isError, error } = api.transaction.getById.useQuery(
    {
      id: Number(searchParams.get("id")) ?? 0,
    },
    {
      enabled: searchParams.has("id"),
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      {/* Main content container with max width */}
      <div className="flex w-full max-w-md flex-col items-center">
        {/* Top section with icon, recipient and amount */}
        <div className="flex w-full flex-col items-center pb-4 pt-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-2xl text-white">
            I
          </div>
          <p className="mb-4 text-lg font-medium">To {data.shop?.name}</p>
          <h1 className="mb-4 text-6xl font-medium">
            {" "}
            {new Intl.NumberFormat("en-IN", {
              currency: "INR",
              style: "currency",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(data.amount)}
          </h1>
          {data.isPaid ? (
            <div className="mb-2 flex items-center">
              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-base">Completed</span>
            </div>
          ) : (
            <div className="mb-2 flex items-center">
              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                <Hourglass className="h-3 w-3 text-white" />
              </div>
              <span className="text-base">Pending</span>
            </div>
          )}
          <p className="mb-4 text-base text-gray-700">
            {formatDate(data.createdAt ?? new Date(), "dd MMM yyyy, hh:mm a")}
          </p>
          <div className="my-2 w-full border-t border-gray-200"></div>
        </div>

        {/* Transaction details card */}
        <div className="mb-8 w-full overflow-hidden rounded-xl border border-gray-200">
          {/* Transaction details */}
          <div className="space-y-5 p-4">
            {!!data.notes && (
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="font-medium">{data.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">transaction ID</p>
              <p className="font-medium">{data.id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">To: {data.shop?.name}</p>
              <p className="font-medium">{data.shop?.upiId}</p>
            </div>
          </div>
        </div>

        {/* UPI Logo */}
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs uppercase text-gray-500">POWERED BY</p>
          <div className="flex justify-center text-3xl font-bold">Baaki</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PaymentReceipt />
    </Suspense>
  );
}
