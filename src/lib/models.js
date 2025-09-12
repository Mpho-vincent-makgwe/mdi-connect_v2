import mongoose from 'mongoose';
import User from '@/models/User';
import Job from '@/models/Job';
import Application from '@/models/Application';
import Interview from '@/models/Interview';
import Notification from '@/models/Notification';

// This ensures all models are registered
export {
  User,
  Job,
  Application,
  Interview,
  Notification
};