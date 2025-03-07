"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Apple, Smartphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener,
    );

    // Wait 5 seconds before showing the redirect button
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener,
      );
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return console.log("No deferred prompt");

    void deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background p-4 text-foreground">
      <h1 className="mb-4 text-2xl font-bold">Install Our App</h1>
      <p className="mb-2">Install our app.</p>
      <p className="text-lg font-bold">
        After installing the app, open the installed app.
      </p>
      <p className="mb-4">
        If you can&apos;t install the app{" "}
        <Link href={"/home"} className={buttonVariants({ variant: "link" })}>
          click here
        </Link>
        .
      </p>

      {isInstallable ? (
        <Button onClick={handleInstallClick} className="mb-4 w-full" size="lg">
          Install App
        </Button>
      ) : (
        !isLoading && <></>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">
          Installation Instructions
        </h2>

        <div className="mb-6">
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <Apple className="mr-2" /> iOS Installation
          </h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Open this page in Safari</li>
            <li>Tap the Share button</li>
            <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
            <li>Tap &quot;Add&quot; in the top right corner</li>
          </ol>
        </div>

        <div>
          <h3 className="mb-2 flex items-center text-lg font-semibold">
            <Smartphone className="mr-2" /> Android Installation
          </h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Open this page in Chrome</li>
            <li>Tap the menu icon (three dots) in the top right</li>
            <li>Tap &quot;Add to Home screen&quot;</li>
            <li>Tap &quot;Add&quot; in the popup</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
