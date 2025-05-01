
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { InvoiceTableRow } from "./InvoiceTableRow";

interface InvoiceItem {
  id: number;
  invoiceNumber: string;
  title: string;
  client: string;
  amount: string;
  date: string;
  status: string;
}

interface InvoicesTableProps {
  invoices: InvoiceItem[];
  onViewDetails: (item: any, type: string) => void;
}

/**
 * Table component that displays all invoices
 * Shows empty state when no invoices are available
 */
export function InvoicesTable({ invoices, onViewDetails }: InvoicesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <InvoiceTableRow 
              key={invoice.id} 
              invoice={invoice} 
              onViewDetails={onViewDetails} 
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
              No invoices found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
