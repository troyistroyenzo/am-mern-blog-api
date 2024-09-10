import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide the content for this post.'],
  },
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);