"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  amount: z.coerce.number().min(1).max(5_00_000),
  notes: z.string().optional(),
});

export default function PayPage() {
  const searchParams = useSearchParams();

  const addTransactionMutation = api.transaction.create.useMutation({
    onSuccess: () => {
      toast.success("Transaction added successfully!");
    },
    onError(error, variables, context) {
      toast.error(error.message);
      console.log({ error, variables, context });
    },
  });

  const {
    data: shop,
    isLoading,
    isError,
    error,
  } = api.shop.findByUpiId.useQuery(
    {
      upiId: searchParams.get("upiId") ?? "NO_UPI_ID",
    },
    {
      enabled: searchParams.has("upiId"),
    },
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (!shop) {
      toast.error("shop is undefined");
      return;
    }
    addTransactionMutation.mutate({
      shopId: shop.id,
      amount: data.amount,
      notes: data.notes,
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (!shop) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="mx-5">
      <div className="mt-12 flex flex-col items-center justify-center gap-2">
        <Avatar className="size-14">
          <AvatarImage src={shop.image ?? ""} />
          <AvatarFallback>{shop.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="text-wrap text-center">
          Paying <span className="font-semibold">{shop.name}</span>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative mx-auto w-fit">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <span className="text-3xl">₹</span>
                      </div>
                      <input
                        placeholder="0"
                        {...field}
                        type="number"
                        autoFocus
                        className="w-[60px] min-w-[60px] pl-5 text-center text-5xl [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        onChange={(e) => {
                          field.onChange(e);
                          const span = document.createElement("span");
                          span.className = "text-5xl absolute opacity-0";
                          span.textContent = e.target.value || "0";
                          document.body.appendChild(span);
                          const width = span.offsetWidth + 40;
                          e.target.style.width = `${Math.min(Math.max(60, width), 250)}px`;
                          document.body.removeChild(span);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="flex w-full justify-center">
                    <input
                      placeholder="Add Notes"
                      {...field}
                      className="mx-auto !w-28 rounded-[10px] bg-muted py-1 text-center text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="fixed bottom-8 left-1/2 w-[calc(100%-2.5rem)] -translate-x-1/2"
              disabled={addTransactionMutation.isPending}
              size="lg"
            >
              Add baaki
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
