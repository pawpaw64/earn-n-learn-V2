
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyApplications, fetchReceivedApplications } from "@/services/applications";
import { fetchMyContacts, fetchReceivedContacts } from "@/services/contacts";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ApplicationList } from "./applications/ApplicationList";

interface ApplicationsTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => Promise<void>;
}

export function ApplicationsTab({ onViewDetails, onStatusChange }: ApplicationsTabProps) {
  // Fetch applications data
  const { 
    data: myApplications = [], 
    isLoading: isLoadingMyApplications 
  } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications
  });

  const { 
    data: receivedApplications = [], 
    isLoading: isLoadingReceivedApplications 
  } = useQuery({
    queryKey: ['receivedApplications'],
    queryFn: fetchReceivedApplications
  });

  const { 
    data: myContacts = [], 
    isLoading: isLoadingMyContacts 
  } = useQuery({
    queryKey: ['myContacts'],
    queryFn: fetchMyContacts
  });

  const { 
    data: receivedContacts = [], 
    isLoading: isLoadingReceivedContacts 
  } = useQuery({
    queryKey: ['receivedContacts'],
    queryFn: fetchReceivedContacts
  });

  // Show loading state while any data is loading
  if (isLoadingMyApplications || isLoadingReceivedApplications || isLoadingMyContacts || isLoadingReceivedContacts) {
    return <LoadingSkeleton />;
  }

  return (
    <ApplicationList 
      myApplications={myApplications}
      receivedApplications={receivedApplications}
      myContacts={myContacts}
      receivedContacts={receivedContacts}
      onViewDetails={onViewDetails}
      onStatusChange={onStatusChange}
    />
  );
}
