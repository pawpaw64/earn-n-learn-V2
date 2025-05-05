
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyInvoices } from "@/services/api/api";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { InvoicesHeader } from "./invoices/InvoicesHeader";
import { InvoicesTable } from "./invoices/InvoicesTable";

interface InvoicesTabProps {
  onViewDetails: (item: any, type: string) => void;
}

/**
 * Main component for the Invoices tab
 * Handles data fetching and displaying invoice data
 */
export function InvoicesTab({ onViewDetails }: InvoicesTabProps) {
  // Fetch invoices data
  const { 
    data: invoices = [], 
    isLoading: isLoadingInvoices
  } = useQuery({
    queryKey: ['myInvoices'],
    queryFn: fetchMyInvoices
  });

  // Ensure invoices is always an array
  const invoicesArray = Array.isArray(invoices) ? invoices : [];

  // Show loading state while fetching data
  if (isLoadingInvoices) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <InvoicesHeader />
      <InvoicesTable 
        invoices={invoicesArray}
        onViewDetails={onViewDetails}
      />
    </>
  );
}
