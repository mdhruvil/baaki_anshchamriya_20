"use client";

import React from "react";
import { centerText, Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function ScanPage() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen">
      <Scanner
        onScan={(data) => {
          data.forEach((result) => {
            if (result.format === "unknown") {
              return;
            }
            let url: URL | undefined;
            try {
              url = new URL(result.rawValue);
            } catch {
              return;
            }
            const isUPIUrl = url.protocol.toLowerCase() === "upi:";

            if (!isUPIUrl) {
              return;
            }

            const upiId = url.searchParams.get("pa");
            if (!upiId) {
              return;
            }

            router.push(`/pay?upiId=${upiId}`);
          });
        }}
        onError={(error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Something went wrong.");
            console.error(error);
          }
        }}
        classNames={{
          video: "object-cover",
          container: "[&>div>div]:top-[50vh] [&>div>div]:translate-y-[-50%]",
        }}
        components={{
          audio: true,
          zoom: true,
          torch: true,
          finder: true,
          onOff: true,
          tracker: centerText,
        }}
        formats={["qr_code", "rm_qr_code", "micro_qr_code"]}
        scanDelay={1000}
      />
    </div>
  );
}

export default ScanPage;
