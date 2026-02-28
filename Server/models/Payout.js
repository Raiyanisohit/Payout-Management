import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  action: { type: String, enum: ['CREATED','SUBMITTED','APPROVED','REJECTED'], required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String }
}, { _id: false });

const payoutSchema = new mongoose.Schema({
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true, min: 0.01 },
  mode: { type: String, enum: ['UPI','IMPS','NEFT'], required: true },
  note: { type: String },
  status: { type: String, enum: ['Draft','Submitted','Approved','Rejected'], default: 'Draft' },
  decision_reason: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  audits: { type: [auditSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('Payout', payoutSchema);
