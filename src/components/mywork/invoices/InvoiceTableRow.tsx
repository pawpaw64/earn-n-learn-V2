
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface InvoiceItem {
  id: number;
  invoiceNumber: string;
  title: string;
  client: string;
  amount: string;
  date: string;
  status: string;
}

interface InvoiceTableRowProps {
  invoice: InvoiceItem;
  onViewDetails: (item: any, type: string) => void;
}

/**
 * Component for rendering a single invoice row in the table
 */
export function InvoiceTableRow({ invoice, onViewDetails }: InvoiceTableRowProps) {
  return (
    <TableRow key={invoice.id}>
      <TableCell>{invoice.invoiceNumber}</TableCell>
      <TableCell>{invoice.title}</TableCell>
      <TableCell>{invoice.client}</TableCell>
      <TableCell>{invoice.amount}</TableCell>
      <TableCell>{invoice.date}</TableCell>
      <TableCell>
        <Badge variant={invoice.status === "Paid" ? "secondary" : "outline"}>
          {invoice.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewDetails(invoice, 'invoice')}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
