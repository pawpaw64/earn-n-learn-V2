
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

/**
 * Header component for the My Works tab
 * Contains the title and filter button
 */
export function WorksHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold">My Works</h2>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="w-4 h-4" /> Filter
      </Button>
    </div>
  );
}
