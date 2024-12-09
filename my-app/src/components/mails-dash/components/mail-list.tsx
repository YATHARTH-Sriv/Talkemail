"use client";

import React from "react";
import { cn } from "@/lib/util";
import { useMail } from "../use-mail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface EMAILFROMAPI {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  when: string;
}

export function MailList({ emails }: { emails: EMAILFROMAPI[] }) {
  const [mail, setMail] = useMail();

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {emails.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() => setMail({ ...mail, selected: item.id })}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="font-semibold">{item.subject}</div>
                <div className="ml-auto text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.when), { addSuffix: true })}
                </div>
              </div>
              <div className="text-xs">{item.snippet}</div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
