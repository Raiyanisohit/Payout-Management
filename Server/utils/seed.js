import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default async function seedUsers() {
  const users = [
    { email: 'ops@demo.com', password: 'ops123', role: 'OPS' },
    { email: 'finance@demo.com', password: 'fin123', role: 'FINANCE' }
  ];

  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ email: u.email, password: hashed, role: u.role });
      console.log(`Seeded user ${u.email}`);
    }
  }
};
