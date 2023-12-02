"use client";

import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { postData } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Loader from "../loader";

export default function SubscriptionModal({
  products,
}: {
  products?: ProductWirhPrice[];
}) {
  const { open, setOpen } = useSubscriptionModal();
  const { toast } = useToast();
  const { subscription, user } = useSupabaseUser();
  const [isLoading, setIsLoading] = useState(false);
  const onClickContinue = async (price: Price) => {
    try {
      setIsLoading(true);
      if (!user) {
        toast({ title: "You must be logged in!" });
        setIsLoading(false);
        return;
      }
      if (subscription) {
        toast({ title: "Already on paid plan" });
        setIsLoading(false);
        return;
      }
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });
      const stripe = await getStripe();
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      toast({
        title: "Yeah something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {subscription?.status === "active" ? (
        <DialogContent>Already on paid plan</DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to pro plan</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            To access Pro features please upgrade to pro plan
          </DialogDescription>
          {products?.length
            ? products?.map((product) => (
                <div
                  className="flex justify-between items-center"
                  key={product.id}
                >
                  {product.prices?.map((price) => (
                    <React.Fragment key={price.id}>
                      <b className="text-3xl text-foreground">
                        {formatPrice(price)} / <small>{price.interval}</small>
                      </b>
                      <Button
                        onClick={() => onClickContinue(price)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : "Upgrade"}
                      </Button>
                    </React.Fragment>
                  ))}
                </div>
              ))
            : ""}
        </DialogContent>
      )}
    </Dialog>
  );
}
