import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Job from '@/models/Job';
import Application from '@/models/Application';
import Interview from '@/models/Interview';
import Notification from '@/models/Notification';

const seedDatabase = async () => {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Clear only the collections we want to seed
    await Promise.all([
      Application.deleteMany(),
      Interview.deleteMany(),
      Notification.deleteMany()
    ]);
    console.log('Cleared existing application, interview, and notification data');

    // Get existing users and jobs to reference
    const [user1, user2] = await User.find().limit(2);
    const [job1, job2] = await Job.find().limit(2);

    if (!user1 || !user2 || !job1 || !job2) {
      throw new Error('Required users or jobs not found in database. Please ensure you have at least 2 users and 2 jobs before seeding.');
    }

    // Create test applications
    const application1 = await Application.create({
      user: user1._id,
      job: job1._id,
      status: 'applied',
      appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      resume: 'resumes/john-doe-mining-engineer.pdf',
      coverLetter: 'cover-letters/john-doe-mining-engineer.pdf'
    });

    const application2 = await Application.create({
      user: user2._id,
      job: job2._id,
      status: 'reviewed',
      appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      resume: 'resumes/jane-smith-tour-guide.pdf'
    });
    console.log('Created test applications');

    // Create test interviews
    const interview1 = await Interview.create({
      user: user1._id,
      application: application1._id,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      type: 'video',
      status: 'scheduled',
      interviewerName: 'Sarah Johnson',
      interviewerEmail: 'sarah@miningcorp.com',
      meetingLink: 'https://zoom.us/j/123456789',
      notes: 'Focus on safety management experience'
    });

    const interview2 = await Interview.create({
      user: user2._id,
      application: application2._id,
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      type: 'in-person',
      status: 'scheduled',
      interviewerName: 'Michael Brown',
      interviewerEmail: 'michael@safari.com',
      location: 'Safari Adventures HQ, 123 Main St, Cape Town',
      notes: 'Prepare wildlife knowledge test'
    });
    console.log('Created test interviews');

    // Create test notifications
    await Notification.create([
      {
        user: user1._id,
        title: 'Application Received',
        message: 'Your application for Mining Engineer has been received',
        type: 'application',
        relatedEntity: application1._id,
        read: false,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      },
      {
        user: user1._id,
        title: 'Interview Scheduled',
        message: 'Your interview for Mining Engineer has been scheduled for ' + 
                 interview1.date.toLocaleDateString(),
        type: 'interview',
        relatedEntity: interview1._id,
        read: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        user: user2._id,
        title: 'Application Reviewed',
        message: 'Your application for Tour Guide is being reviewed',
        type: 'application',
        relatedEntity: application2._id,
        read: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]);
    console.log('Created test notifications');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();