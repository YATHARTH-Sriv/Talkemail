import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import EmailModel from "@/lib/db/model/save.email.model";
import dbconnect from "@/lib/db/connect";

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await dbconnect();

    // Parse the request body
    const body = await req.json();
    const { emailtobemonitored, emailid } = body;
    console.log(emailtobemonitored,emailid);

    // Get access token from headers
    const accessToken = req.headers.get("authorization")?.replace("Bearer ", "");
    console.log("token",accessToken);
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken
    });

    // Initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 1,
      q: `from:${emailtobemonitored} `
    });
    console.log(response.data.messages);
    // Fetch full details for each message
    const emails = await Promise.all(
      (response.data.messages || []).map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full'
        });
        // console.log("new header mail",msg.data.payload?.headers);

        // Extract headers
        const headers = msg.data.payload?.headers || [];
        const timeheader=headers.find(h => h.name === 'Date');
        console.log(timeheader);
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const fromHeader = headers.find(h => h.name === 'From');
        return {
          id: msg.data.id,
          snippet: msg.data?.snippet,
          subject: subjectHeader?.value,
          from: fromHeader?.value,
          when: timeheader?.value
        };
      })
    );
    const existing=await EmailModel.findOne({emailToBeTakenCareOf: emailtobemonitored})
    if(!existing){
      const emailadded=await EmailModel.create({
        emailOfUser: emailid,
        emailToBeTakenCareOf: emailtobemonitored,
        SavedEmail: emails
      })
  
      console.log(emailadded);
    }else {
      console.log("Email record already exists:", existing);
    }
    return NextResponse.json({ emails });

  } catch (error) {
    console.error('Email fetch error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}