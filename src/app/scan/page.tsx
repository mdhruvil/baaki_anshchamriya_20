"use client";
import { centerText, Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ScanPage() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-screen bg-gray-900">
      {/* Scanner Component */}
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

            setTimeout(() => {
              router.push(`/pay?upiId=${upiId}`);
            }, 800);
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
          video: "object-cover h-screen w-screen opacity-90",
          container: "h-screen w-screen",
        }}
        components={{
          audio: false,
          zoom: true,
          finder: false,
          onOff: true,
          tracker: centerText,
        }}
        formats={["qr_code", "rm_qr_code", "micro_qr_code"]}
        scanDelay={1000}
      />

      {/* Overlay with gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 to-black/40" />

      {/* Header */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <div className="text-lg font-semibold text-white">Scanner</div>
        <button
          onClick={() => router.back()}
          className="pointer-events-auto rounded-full bg-white/20 p-2 text-white backdrop-blur-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Professional Scanner Frame with Animation */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80">
          {/* Stylish Corners */}
          <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-blue-400" />
          <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-blue-400" />
          <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-blue-400" />
          <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-4 border-r-4 border-blue-400" />
        </div>

        {/* Helper Text */}
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <p className="mx-auto w-fit rounded-full bg-black/20 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm">
            Align QR code within the frame
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScanPage;
