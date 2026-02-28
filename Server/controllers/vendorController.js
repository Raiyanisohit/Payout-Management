import Vendor from '../models/Vendor.js';

export async function listVendors(req, res, next) {
  try {
    const vendors = await Vendor.find();
    res.json({ success: true, vendors });
  } catch (err) { next(err); }
}
export async function createVendor(req, res, next) {
  try {
    const { name, upi_id, bank_account, ifsc } = req.body;
    const v = await Vendor.create({ name, upi_id, bank_account, ifsc });
    res.status(201).json({ success: true, vendor: v });
  } catch (err) { next(err); }
}
