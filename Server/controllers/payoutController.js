import Payout from '../models/Payout.js';
import Vendor from '../models/Vendor.js';

function apiError(status, message, code) {
  const err = new Error(message);
  err.status = status;
  if (code) err.code = code;
  return err;
}

async function listPayouts(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.vendor) filter.vendor_id = req.query.vendor;
    const payouts = await Payout.find(filter).populate('vendor_id').populate('createdBy', 'email role');
    res.json({ success: true, payouts });
  } catch (err) { next(err); }
}

async function createPayout(req, res, next) {
  try {
    // Only OPS can create payouts
    if (req.user.role !== 'OPS') return next(apiError(403, 'Forbidden: only OPS can create payouts'));
    const { vendor_id, amount, mode, note } = req.body;
    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return next(apiError(400, 'vendor not found', 'VENDOR_NOT_FOUND'));
    const payout = await Payout.create({ vendor_id, amount, mode, note, createdBy: req.user.id, audits: [{ action: 'CREATED', performedBy: req.user.id }] });
    res.status(201).json({ success: true, payout });
  } catch (err) { next(err); }
}

async function getPayout(req, res, next) {
  try {
    const payout = await Payout.findById(req.params.id).populate('vendor_id').populate('audits.performedBy', 'email role');
    if (!payout) return next(apiError(404, 'Payout not found'));
    res.json({ success: true, payout });
  } catch (err) { next(err); }
}

async function submitPayout(req, res, next) {
  try {
    // only OPS can submit own Draft payout
    if (req.user.role !== 'OPS') return next(apiError(403, 'Forbidden: only OPS can submit payouts'));
    const payout = await Payout.findById(req.params.id);
    if (!payout) return next(apiError(404, 'Payout not found'));
    if (payout.createdBy.toString() !== req.user.id) return next(apiError(403, 'Can only submit your own payouts'));
    if (payout.status !== 'Draft') return next(apiError(400, 'Can only submit Draft payouts', 'INVALID_STATUS'));
    payout.status = 'Submitted';
    payout.audits.push({ action: 'SUBMITTED', performedBy: req.user.id });
    await payout.save();
    res.json({ success: true, payout });
  } catch (err) { next(err); }
}

async function approvePayout(req, res, next) {
  try {
    if (req.user.role !== 'FINANCE') return next(apiError(403, 'Forbidden: only FINANCE can approve'));
    const payout = await Payout.findById(req.params.id);
    if (!payout) return next(apiError(404, 'Payout not found'));
    if (payout.status !== 'Submitted') return next(apiError(400, 'Only Submitted payouts can be approved', 'INVALID_STATUS'));
    payout.status = 'Approved';
    payout.audits.push({ action: 'APPROVED', performedBy: req.user.id });
    await payout.save();
    res.json({ success: true, payout });
  } catch (err) { next(err); }
}

async function rejectPayout(req, res, next) {
  try {
    if (req.user.role !== 'FINANCE') return next(apiError(403, 'Forbidden: only FINANCE can reject'));
    const { decision_reason } = req.body;
    const payout = await Payout.findById(req.params.id);
    if (!payout) return next(apiError(404, 'Payout not found'));
    if (payout.status !== 'Submitted') return next(apiError(400, 'Only Submitted payouts can be rejected', 'INVALID_STATUS'));
    if (!decision_reason) return next(apiError(400, 'decision_reason required', 'MISSING_DECISION_REASON'));
    payout.status = 'Rejected';
    payout.decision_reason = decision_reason;
    payout.audits.push({ action: 'REJECTED', performedBy: req.user.id, note: decision_reason });
    await payout.save();
    res.json({ success: true, payout });
  } catch (err) { next(err); }
}

export {
  listPayouts,
  createPayout,
  getPayout,
  submitPayout,
  approvePayout,
  rejectPayout
};
