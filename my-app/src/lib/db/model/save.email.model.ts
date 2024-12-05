import mongoose, { Schema, Document} from "mongoose";

interface Email {
    id: string;
    subject: string;
    snippet: string;
    from: string;
    when: string
}

export interface SaveEmail extends Document {
  emailOfUser: string, 
  emailToBeTakenCareOf: string,
  // companyname: string,
  SavedEmail: Email[],
}

const EmailSchema: Schema<SaveEmail> = new Schema(
    {
    emailOfUser: { type: String, required: true },
    emailToBeTakenCareOf: { type: String, required: true },
    // companyname: { type: String, required: true },
    SavedEmail: { type: [new Schema<Email>({ 
        id: { type: String, required: true },
        subject: { type: String, required: true },
        snippet: { type: String, required: true },
        from: { type: String, required: true },
        when: { type: String, required: true }
    })], required: false }
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

const EmailModel =
  (mongoose.models.Email as mongoose.Model<Email>) ||
  mongoose.model<Email>("Email", EmailSchema);

export default EmailModel;