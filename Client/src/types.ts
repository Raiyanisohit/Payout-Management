export type Vendor = {
  _id: string
  name: string
  upi_id?: string
  bank_account?: string
  ifsc?: string
  is_active?: boolean
}

export type Payout = {
  _id: string
  vendor: Vendor
  vendor_id: string
  amount: number
  mode: 'UPI' | 'IMPS' | 'NEFT'
  note?: string
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
  decision_reason?: string
  auditTrail?: Array<{ action: string; by: string; at: string; reason?: string }>
  createdAt?: string
  updatedAt?: string
}
