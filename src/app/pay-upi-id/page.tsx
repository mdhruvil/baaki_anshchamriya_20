"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function UpiIdInputContent() {
  const [upiId, setUpiId] = useState<string>("");
  const router = useRouter();

  const handleContinue = () => {
    if (upiId) {
      router.push(`/pay?upiId=${upiId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-md p-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-gray-900">
            <ChevronLeft size={24} />
          </Link>
          <MoreVertical size={24} />
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="mb-1 text-2xl font-medium">Enter UPI ID</h1>
        </div>

        {/* UPI ID input */}
        <div className="relative mb-8 overflow-hidden rounded-lg border border-gray-200">
          <div className="flex items-center p-3">
            <div className="mr-2 flex w-full items-center">
              <Input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border-none bg-transparent p-0 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="example@upi"
              />
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="fixed bottom-8 left-0 right-0 px-4">
          <Button
            onClick={handleContinue}
            className="w-full bg-blue-600 py-3 text-white"
            disabled={!upiId}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <UpiIdInputContent />
    </Suspense>
  );
}
