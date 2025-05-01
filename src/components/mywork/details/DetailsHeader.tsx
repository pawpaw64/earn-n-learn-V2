
import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DetailsHeaderProps {
  title: string | undefined;
}

/**
 * Renders the header section of details dialog
 */
export const DetailsHeader: React.FC<DetailsHeaderProps> = ({ title }) => (
  <DialogHeader>
    <DialogTitle>{title || "Details"}</DialogTitle>
    <DialogDescription>View detailed information</DialogDescription>
  </DialogHeader>
);
