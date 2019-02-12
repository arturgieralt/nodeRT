import { Schema, model } from 'mongoose';

export const ArticleSchema = new Schema({
  title: { type: String, required: [true, 'Please provide a title'] },
  content: { type: String, required: [true, 'Please provide a content'] },
  summary: { type: String, required: false },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  commentsAllowed: { type: Boolean, default: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  created_date: {
    type: Date,
    default: Date.now()
  },
  last_updated: {
    type: Date,
    default: Date.now()
  }
});

export const ArticleModel = model('Article', ArticleSchema, 'articles');