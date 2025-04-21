import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
export default function MyWork() {
  return <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Work</h1>
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-2 mx-0 px-[340px]">
          <TabsTrigger value="applications" className="px-[35px]">Applications</TabsTrigger>
          <TabsTrigger value="myworks" className="px-[35px]">My Works</TabsTrigger>
          <TabsTrigger value="myposts" className="px-[35px]">My Posts</TabsTrigger>
          <TabsTrigger value="invoices" className="px-[36px]">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Applications</span>
            <button className="inline-flex items-center px-3 py-1 rounded-md border hover:bg-accent text-sm gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
          <div className="bg-white rounded-md border p-8 text-center text-gray-500">
            Placeholder for Applications (jobs, materials, skills).<br />
            Add filters and data here in the future.
          </div>
        </TabsContent>
        <TabsContent value="myworks">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">My Works</span>
            <button className="inline-flex items-center px-3 py-1 rounded-md border hover:bg-accent text-sm gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
          <div className="bg-white rounded-md border p-8 text-center text-gray-500">
            Placeholder for accepted jobs, skills, and materials exchange.<br />
            Add filters and details here in the future.
          </div>
        </TabsContent>
        <TabsContent value="myposts">
          <div className="mb-4 text-lg font-semibold">My Posts</div>
          <div className="bg-white rounded-md border p-8 text-center text-gray-500">
            Placeholder for your posted jobs, skills, and material exchanges.
          </div>
        </TabsContent>
        <TabsContent value="invoices">
          <div className="mb-4 text-lg font-semibold">Invoices</div>
          <div className="bg-white rounded-md border p-8 text-center text-gray-500">
            Placeholder for all sent and received transactions.
          </div>
        </TabsContent>
      </Tabs>
    </div>;
}