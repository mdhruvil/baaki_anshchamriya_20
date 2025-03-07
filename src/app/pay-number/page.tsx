"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { type shops } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Define proper types for shop data
type ShopType = typeof shops.$inferSelect;

function PhoneSearchContent() {
  const [searchQuery, setSearchQuery] = useState<string>("+91 ");
  const [filteredShops, setFilteredShops] = useState<ShopType[]>([]);
  const router = useRouter();

  // Fetch shops using tRPC
  const {
    data: shops,
    isLoading,
    error,
  } = api.shop.getShops.useQuery<ShopType[]>();

  useEffect(() => {
    // Filter shops based on the search query
    if (shops && searchQuery.length > 4) {
      const filtered = shops.filter((shop) =>
        shop.phoneNumber?.includes(searchQuery.replace(/\s/g, "").slice(3)),
      );
      setFilteredShops(filtered);
    } else if (shops) {
      setFilteredShops(shops);
    }
  }, [searchQuery, shops]);

  const handleShopClick = (upiId: string) => {
    router.push(`/pay?upiId=${upiId}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-900">
        <p>Loading shops...</p>
      </div>
    );
  }

  if (error || !shops) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-900">
        <p>Error loading shops: {error?.message ?? "Failed to load data"}</p>
      </div>
    );
  }

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
          <h1 className="mb-1 text-2xl font-medium">Enter a phone number</h1>
        </div>

        {/* Phone input */}
     
          <div className="flex items-center p-3">
            <div className="mr-2 flex w-full items-center">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent p-4 py-6 text-gray-900"
                placeholder="+91"
              />
            </div>
          </div>
 

        {/* People list */}
        <div>
          <h2 className="mb-4 text-xl">People</h2>
          <div className="space-y-4">
            {filteredShops.length === 0 ? (
              <p className="py-4 text-center text-gray-500">
                No shops found matching your search
              </p>
            ) : (
              filteredShops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex cursor-pointer items-center gap-3"
                  onClick={() => handleShopClick(shop.upiId)}
                >
                  <Avatar className="size-10">
                    <AvatarImage src={shop?.image ?? ""} />
                    <AvatarFallback>{shop?.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{shop.name}</p>
                    <p className="text-sm text-gray-600">
                      {shop.phoneNumber || "No phone number"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PhoneSearchContent />
    </Suspense>
  );
}
