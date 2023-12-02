"use client";

import SubscriptionModal from "@/components/global/subscription-modal";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type SubscriptionModalContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SubscriptionModalContext = createContext<SubscriptionModalContextType>({
  open: false,
  setOpen: () => {},
});

export const useSubscriptionModal = () => {
  return useContext(SubscriptionModalContext);
};

export const SubscriptionModalProvider = ({
  children,
  products,
}: {
  children: React.ReactNode;
  products?: ProductWirhPrice[];
}) => {
    const [open, setOpen] = useState(false)

    return(
        <SubscriptionModalContext.Provider value={{open, setOpen}}>
            {children}
         <SubscriptionModal products={products} />
        </SubscriptionModalContext.Provider>
    )
};
