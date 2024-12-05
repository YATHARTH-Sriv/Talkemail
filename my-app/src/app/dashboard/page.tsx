'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, LogOut, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'


interface APIDATATYPE {
  emails: EMAILFROMAPI[]; // Updated to match API response key
  success: boolean;
}

interface EMAILFROMAPI {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  when: string;
  _id: string;
}

interface sortedemailtype{
  from: any; 
  emails: EMAILFROMAPI[]
}

function Page() {
  const { data: session } = useSession();
  const [emaildata, setemailData] = useState<APIDATATYPE | null>(null); // State holds the full response object.
  const [selectedEmailObject, setSelectedEmailObject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortedarraymade, setsortedarraymade] = useState<sortedemailtype[]>([])
  const emailidofuser = session?.user.email;
  const [selectedCategory, setSelectedCategory] = useState(null)
  useEffect(() => {
    const fetchAndSortEmails = async () => {
      if (session) {
        setLoading(true);
        try {
          const res = await axios.post<APIDATATYPE>('/api/email-data', {
            emailid: session?.user.email,
          });
          
          // Sort emails immediately after fetching
          const uniqueFroms = [...new Set(res.data.emails.map(email => email.from))];
          
          const sortedArray = uniqueFroms.map(from => ({
            from,
            emails: res.data.emails.filter(email => email.from === from)
          }));
  
          setemailData(res.data);
          setsortedarraymade(sortedArray);
          console.log(sortedarraymade) // Assuming you have a state to store sorted emails
          setLoading(false);
        } catch (error) {
          console.error('Error fetching email data:', error);
          setLoading(false);
        }
      }
    };
  
    fetchAndSortEmails();
  }, [session]);
  
    const handleNewEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const res = await axios.post('/api/gmail/fetch-email', {
            emailid: emailidofuser,
            emailtobemonitored: newEmail
          },
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          });
          setemailData(res.data)
          setNewEmail('');
          setIsModalOpen(false);
        } catch (error) {
          console.error("Failed to add email:", error);
        }
    };

  return (
        <>
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="flex flex-col space-y-3">
                <p>Generating Your Dashboard...</p>
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-screen bg-gray-100">
              {/* Left Sidebar */}
              <div className="w-1/4 bg-white p-6 shadow-md flex flex-col justify-between h-full">
                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {"Select Email"}
                      <span className="ml-2">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select Email</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {emaildata && emaildata?.emails && emaildata.emails.map((email) => (
                      <DropdownMenuItem
                        key={email.id}
                        onSelect={() => setSelectedEmailObject({ email: email.from, id: email.id })}
                      >
                        {email.from}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
    
                {/* Add Email Button */}
                <Button className="mt-4 w-full" onClick={() => setIsModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Email
                </Button>
    
                {/* Session Info */}
                {session?.user && (
                  <div className="flex items-center space-x-4 border-t pt-4 mt-4">
                    <Avatar>
                      <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "User"} />
                      <AvatarFallback>{session.user.name?.charAt(0) ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <Button
                        onClick={() => signOut({ callbackUrl: "/Login" })}
                        className="px-0 text-red-500 hover:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
    
              {/* Right Content Area */}
              <div className="w-3/4 p-6">
            {selectedCategory ? (
              <DetailView
                sortedemailarray={sortedarraymade.filter(item => item.from === selectedCategory)}
                onBack={() => setSelectedCategory(null)}
                index={Math.floor(Math.random() * 3) + 1}
              />
            ) : (
              <motion.div
                key="dashboard"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {sortedarraymade.map((item, index) => (
                  <CategoryCard
                    key={index}
                    emailfrom={item.from}
                    index={item.emails.length}
                    onClick={() => setSelectedCategory(item.from)}
                  />
                ))}
              </motion.div>
            )}
              </div>
    
              {/* Modal for adding new email */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Email to Monitor</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleNewEmailSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="col-span-3"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Add Email</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </>
  );
}


export default Page;


function CategoryCard({ emailfrom,index,onClick}: { emailfrom: string, index: number, onClick: () => void  }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">{emailfrom}</h2>
          <p className="text-muted-foreground">Click to view details</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DetailView({
  sortedemailarray,
  onBack,
  index,
}: {
  sortedemailarray: sortedemailtype[];
  onBack: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="space-y-6"
    >
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-3xl font-bold mb-6">{sortedemailarray[0].from}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedemailarray.map((item, itemIndex) =>
          item.emails.map((email, emailIndex) => (
            <motion.div
              key={`${itemIndex}-${emailIndex}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: emailIndex * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{email.subject}</h3>
                  <p className="text-muted-foreground">{email.snippet}</p>
                  <p className="text-muted-foreground text-sm">{email.when}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}






