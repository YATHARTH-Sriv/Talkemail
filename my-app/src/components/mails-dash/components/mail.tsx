"use client";

import React, { useState } from "react";
import { Inbox, File, Send, ArchiveX, Trash2, Archive } from "lucide-react";
import { cn } from "@/lib/util";
import { useMail } from "../use-mail";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Nav } from "./nav";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { MailList } from "./mail-list";
import { MailDisplay } from "./mail-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface EMAILFROMAPI {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  when: string;
}

interface MailProps {
  mails: EMAILFROMAPI[];
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [mail, setMail] = useMail();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
                  All mail
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList emails={mails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList emails={mails.filter((mail) => !mail.snippet.includes("read"))} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        {/* <ResizableHandle withHandle /> */}
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay mail={mails.find((item) => item.id === mail.selected)} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
