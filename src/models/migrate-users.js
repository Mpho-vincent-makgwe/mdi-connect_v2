// migrate-users.js
import mongoose from 'mongoose';
import User from './User.js';

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Add new field with default value to all users
  await User.updateMany(
    { sector: { $exists: false } }, // Only update if field doesn't exist
    { $set: { sector: null } }
  );

  // Convert empty strings to null
  await User.updateMany(
    { sector: '' },
    { $set: { sector: null } }
  );

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});