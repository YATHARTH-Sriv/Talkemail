import dbconnect from "@/lib/db/connect";
import EmailModel from "@/lib/db/model/save.email.model";
import { NextRequest, NextResponse } from "next/server";

interface Email {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  when: string;
}

interface RecievedEmail extends Document {
  emailOfUser: string;
  emailToBeTakenCareOf?: string;
  SavedEmail: Email[];
}

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbconnect();

    // Parse the request body
    const { emailid } = await req.json();
    if (!emailid) {
      return NextResponse.json(
        { success: false, error: "Email ID is required" },
        { status: 400 }
      );
    }

    console.log("Email ID received:", emailid);

    // Query the database to find all matching documents
    const savedEmails: RecievedEmail[] = await EmailModel.find(
      { emailOfUser: emailid }, // Query filter
      { SavedEmail: 1, _id: 0 } // Projection: Include only SavedEmail field
    );

    if (!savedEmails.length) {
      return NextResponse.json(
        { success: false, error: "No emails found for this user" },
        { status: 404 }
      );
    }

    // Extract SavedEmail data from all documents
    const emails = savedEmails.flatMap((doc) => doc.SavedEmail || []);
    console.log("All emails found:", emails);

    // Respond with the combined email data
    return NextResponse.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
