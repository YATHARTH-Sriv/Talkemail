"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Email {
  id: string;
  snippet: string;
  subject?: string;
  from?: string;
  when?: string;
}

const EmailList = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const emailtobemonitored="per@scrimba.com"

  useEffect(() => {
    const fetchEmails = async () => {
      if (!accessToken) {
        setError("No access token available");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "/api/gmail/fetch-email",
          {
            emailtobemonitored: emailtobemonitored,
            emailid: session?.user?.email
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
          }
        );

        const data = response.data;
        if (data.emails) {
          setEmails(data.emails);
        } else {
          setError("No emails found");
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
        setError("Failed to fetch emails");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [session]);

  if (loading) return <p>Loading emails...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Inbox</h2>
      {emails.length === 0 ? (
        <p>No emails found</p>
      ) : (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <p><strong>Subject:</strong> {email.subject || "No Subject"}</p>
              <p><strong>From:</strong> {email.from || "Unknown"}</p>
              <p><strong>Snippet:</strong> {email.snippet}</p>
              <p><strong>When:</strong> {email.when}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailList;