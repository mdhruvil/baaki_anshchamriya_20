"use client";
import React, { useState, useEffect } from "react";
import { centerText, Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Flashlight } from "lucide-react";
import { Button } from "@/components/ui/button";

function ScanPage() {
  const router = useRouter();
  const [isScanningActive, setIsScanningActive] = useState(true);
  const [torchActive, setTorchActive] = useState(false);
  
  // Scanning animation effect
  const [scanLinePosition, setScanLinePosition] = useState(0);
  
  useEffect(() => {
    if (isScanningActive) {
      const interval = setInterval(() => {
        setScanLinePosition(prev => (prev >= 100 ? 0 : prev + 2));
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isScanningActive]);

  // Toggle torch function
  const toggleTorch = () => {
    // In a real implementation, you would connect this to the scanner's torch functionality
    setTorchActive(!torchActive);
  };

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
            
            // Remove scan success feedback
            setIsScanningActive(false);
            
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
          torch: true,
          finder: false,
          onOff: true,
          tracker: centerText,
        }}
        formats={["qr_code", "rm_qr_code", "micro_qr_code"]}
        scanDelay={1000}
      />
      
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/40 pointer-events-none" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <div className="text-white font-semibold text-lg">UPI Scanner</div>
        <button 
          onClick={() => router.back()} 
          className="text-white bg-white/20 rounded-full p-2 backdrop-blur-sm pointer-events-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {/* Professional Scanner Frame with Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
          {/* Stylish Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
        </div>
        
        {/* Helper Text */}
        <div className="absolute bottom-20 left-0 right-0 text-center">
          <p className="text-white/90 font-medium text-sm backdrop-blur-sm bg-black/20 mx-auto w-fit px-4 py-2 rounded-full">
            Align QR code within the frame
          </p>
        </div>
      </div>
      
      {/* Center Flashlight Button - Replacing Camera */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <Button 
          onClick={toggleTorch} 
          className="p-4 bg-blue-500 rounded-full shadow-lg pointer-events-auto"
        >
          <Flashlight size={24} color="white" />
        </Button>
      </div>
    </div>
  );
}

export default ScanPage;