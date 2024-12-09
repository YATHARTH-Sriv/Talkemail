"use client";

import React from "react";
import { Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EMAILFROMAPI {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  when: string;
}

interface MailDisplayProps {
  mail?: EMAILFROMAPI;
}

export function MailDisplay({ mail }: MailDisplayProps) {
  if (!mail) {
    return <div className="flex items-center justify-center h-full">No email selected</div>;
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{mail.subject}</h2>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Archive className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />
      <p className="text-sm text-muted-foreground">From: {mail.from}</p>
      <p className="mt-2">{mail.snippet}</p>
    </div>
  );
}
