
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Eye } from "lucide-react";
import { fetchMyInvoices } from "@/services/api";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface InvoicesTabProps {
  onViewDetails: (item: any, type: string) => void;
}

export function InvoicesTab({ onViewDetails }: InvoicesTabProps) {
  const { 
    data: invoices = [], 
    isLoading: isLoadingInvoices
  } = useQuery({
    queryKey: ['myInvoices'],
    queryFn: fetchMyInvoices
  });

  if (isLoadingInvoices) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>
      
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
          {invoices?.map((invoice) => (
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
          ))}
          {invoices?.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No invoices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
