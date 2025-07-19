// app/api/jobs/route.js
import { dbConnect } from '@/lib/dbConnect';
import Job from '@/models/Job';

export async function GET() {
  try {
    await dbConnect("MDI-Connect");
    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 });
    return Response.json({ jobs });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}