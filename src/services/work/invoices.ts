
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    title: "Website Development",
    amount: "$500",
    status: "Paid",
    date: "2024-04-01",
    client: "Student Union",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    title: "Tutoring Services",
    amount: "$300",
    status: "Pending",
    date: "2024-04-15",
    client: "CS Department",
  }
];

export const fetchMyInvoices = async () => {
  // TODO: Replace with actual API call when backend is implemented
  return mockInvoices;
};
