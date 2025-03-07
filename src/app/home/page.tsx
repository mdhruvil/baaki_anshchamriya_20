"use client";
import Login from "@/components/Login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import User from "@/components/User";
import { api } from "@/trpc/react";
import { formatDate } from "date-fns";
import {
  AtSignIcon,
  ScanQrCodeIcon,
  SmartphoneIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const mainMenu: Array<{ Icon: LucideIcon; name: string; href: string }> = [
  {
    name: "Scan any \nQR code",
    href: "/scan",
    Icon: ScanQrCodeIcon,
  },
  {
    name: "Pay phone number",
    href: "/pay-number",
    Icon: SmartphoneIcon,
  },
  {
    name: "Pay any UPI ID",
    href: "/pay-upi-id",
    Icon: AtSignIcon,
  },
];

function MainMenu() {
  return (
    <div className="grid grid-cols-3">
      {mainMenu.map((menu) => {
        return (
          <Link
            key={menu.name}
            href={menu.href}
            className="flex flex-col items-center justify-center gap-2"
          >
            <menu.Icon className="size-6 text-blue-500" />
            <div className="w-[80%] text-center text-xs">{menu.name}</div>
          </Link>
        );
      })}
    </div>
  );
}

export default function Page() {
  const { data, isLoading, isError, error } = api.home.getData.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    if (error.data?.code === "UNAUTHORIZED") {
      return <Login />;
    }
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="mx-5 mt-5 space-y-6">
      <User
        email={data.user.email ?? ""}
        image={data.user.image ?? ""}
        id={parseInt(data.user.id) ?? null}
        name={data.user.name ?? ""}
      />
      <MainMenu />
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Businesses</h3>
        <div className="grid grid-cols-4 gap-4">
          {data.shops.map((shop) => (
            <Link key={shop.id} href={`/chat?shopId=${shop.id}`}>
              <div className="flex flex-col items-center gap-2">
                <Avatar className="size-12">
                  <AvatarImage src={shop.image ?? ""} />
                  <AvatarFallback>{shop.name}</AvatarFallback>
                </Avatar>
                <span className="line-clamp-2 text-center text-xs">
                  {shop.name}
                </span>
              </div>
            </Link>
          ))}
          {data.shops.length === 0 && (
            <div className="col-span-4 text-center text-gray-500">
              No businesses found
            </div>
          )}
        </div>
      </div>
      <div className="space-y-5">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <div className="space-y-6">
          {data.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-3">
              <Link href={`/chat?shopId=${transaction.shopId}`}>
                <Avatar className="size-10">
                  <AvatarImage src={transaction.shop?.image ?? ""} />
                  <AvatarFallback>{transaction.shop?.name}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex w-full items-center justify-between gap-2">
                <div>
                  <p className="line-clamp-1 text-sm">
                    {transaction.shop?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.createdAt ?? "", "dd MMMM")}
                  </p>
                </div>
                <div>
                  {new Intl.NumberFormat("en-IN", {
                    currency: "INR",
                    style: "currency",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(transaction.amount)}
                </div>
              </div>
            </div>
          ))}
          {data.transactions.length === 0 && (
            <div className="col-span-4 text-center text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
