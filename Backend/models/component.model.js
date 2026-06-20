import mongoose from 'mongoose'

const componentSchema = new mongoose.Schema({
  name: String,
  code: String,
  props: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected', 'published'],
    default: 'draft'
  },
  submittedAt: Date,
  submissionDescription: String,
  reviewedAt: Date,
  reviewNotes: String,
  rejectionReason: String,
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  npmPackage: String
}, { timestamps: true })

export const Component = mongoose.model("Component", componentSchema)