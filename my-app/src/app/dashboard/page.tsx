'use client';
import MailPage from '@/components/mails-dash/page';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, File, Send, ArchiveX, Trash2, Archive, LogOut, Plus } from "lucide-react";
import { Nav } from '@/components/mails-dash/components/nav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IoArrowBackOutline, IoMailOutline } from "react-icons/io5";

interface APIDATATYPE {
  emails: EMAILFROMAPI[];
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

interface sortedemailtype {
  from: string;
  emails: EMAILFROMAPI[];
}

function Page() {
  const { data: session } = useSession();
  const [emailData, setEmailData] = useState<APIDATATYPE | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortedEmails, setSortedEmails] = useState<sortedemailtype[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userEmail = session?.user.email;

  useEffect(() => {
    const fetchAndSortEmails = async () => {
      if (session) {
        setLoading(true);
        try {
          const res = await axios.post<APIDATATYPE>('/api/email-data', { emailid: userEmail });
          const uniqueFroms = [...new Set(res.data.emails.map(email => email.from))];
          const sortedArray = uniqueFroms.map(from => ({
            from,
            emails: res.data.emails.filter(email => email.from === from),
          }));

          setEmailData(res.data);
          setSortedEmails(sortedArray);
        } catch (error) {
          console.error('Error fetching email data:', error);
        } finally {
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
        emailid: userEmail,
        emailtobemonitored: newEmail,
      }, {
        headers: {
          "authorization": `Bearer ${session?.accessToken}`,
        },
      });
      
      setEmailData(res.data);
      setNewEmail('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add email:', error);
    }
  };

  return (
    <div className="w-full h-screen grid grid-cols-12 bg-gradient-to-br from-blue-50 to-white text-gray-800">
      {/* Sidebar */}
      <div className={`col-span-2 flex flex-col bg-white border-r border-gray-200 p-2 transition-all ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Compact Header with Toggle */}
        <div className="flex items-center justify-between mb-4 p-2">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <IoMailOutline className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">TalkEmail</h2>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-gray-100 text-gray-600 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            {isCollapsed ? '>' : '<'}
          </button>
        </div>

        {/* Email Account Selector */}
        {!isCollapsed ? (
          <select
            className="w-full p-2 mb-4 bg-gray-50 text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="" disabled>Select Email Account</option>
            {session && <option value={session.user.email}>{session.user.email}</option>}
          </select>
        ) : (
          <div className="flex justify-center mb-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={session?.user.image || ''} alt={session?.user.name || 'User'} />
              <AvatarFallback>{session?.user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Navigation Links */}
        <Nav
          links={[
            { title: "Inbox", label: "128", icon: Inbox, variant: "default" },
            { title: "Drafts", label: "9", icon: File, variant: "ghost" },
            { title: "Sent", label: "", icon: Send, variant: "ghost" },
            { title: "Junk", label: "23", icon: ArchiveX, variant: "ghost" },
            { title: "Trash", label: "", icon: Trash2, variant: "ghost" },
            { title: "Archive", label: "", icon: Archive, variant: "ghost" },
          ]}
          isCollapsed={isCollapsed}
        />

        {/* Add Email Button and User Info */}
        <div className="mt-auto p-2">
          <Button 
            className={`w-full ${isCollapsed ? 'p-2' : ''} bg-blue-600 hover:bg-blue-700 text-white`}
            onClick={() => setIsModalOpen(true)}
          >
            {isCollapsed ? <Plus className="h-5 w-5" /> : <><Plus className="mr-2 h-4 w-4" /> Add Email</>}
          </Button>

          {/* User Info */}
          {session?.user && (
            <div className="mt-4 flex items-center justify-center">
              {!isCollapsed ? (
                <div className="flex items-center gap-3 w-full">
                  <Avatar>
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || 'User'} />
                    <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-800 truncate">{session.user.name}</p>
                    <Button
                      variant="ghost"
                      onClick={() => signOut({ callbackUrl: "/Login" })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: "/Login" })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-10 p-8 bg-gray-50">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to TalkEmail</h1>
          <p className="text-gray-600">Manage your emails with ease and efficiency.</p>
        </header>

        {/* Emails or Categories */}
        {selectedCategory ? (
          <motion.div key="mail-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory(null)} 
              className="mb-4 text-blue-600 hover:bg-blue-50"
            >
              <IoArrowBackOutline className="mr-2" /> Back
            </Button>
            <MailPage 
              sortedemail={sortedEmails.filter(item => item.from === selectedCategory)} 
            />
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            {sortedEmails.map((item, index) => (
              <CategoryCard
                key={index}
                emailFrom={item.from.split('<')[0].trim().replaceAll('"', '')}
                emailCount={item.emails.length}
                onClick={() => setSelectedCategory(item.from)}
              />
            ))}
            <motion.div
              className="cursor-pointer rounded-lg bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-8 w-8 text-blue-600" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Add Email Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Add New Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewEmailSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="col-span-3 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Email
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Category Card Component
function CategoryCard({
  emailFrom,
  emailCount,
  onClick,
}: {
  emailFrom: string;
  emailCount: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="cursor-pointer rounded-lg bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold text-gray-900">{emailFrom}</h2>
      <p className="text-gray-600">{emailCount} emails</p>
    </motion.div>
  );
}

export default Page;