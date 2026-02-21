import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  user: mongoose.Types.ObjectId;
  fileType: string;
  filePath: string;
  hashCode?: string;
  createdAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    hashCode: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IFile>("FileModel", FileSchema);
