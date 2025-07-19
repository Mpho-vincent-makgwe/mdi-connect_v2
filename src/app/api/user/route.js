// app/api/auth/user/route.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect("MDI-Connect");
    
    // In a real app, you would get the user ID from the session
    const user = await User.findOne({ email: 'example@user.com' });
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect("MDI-Connect");
    const updates = await request.json();
    
    // In a real app, you would get the user ID from the session
    const user = await User.findOneAndUpdate(
      { email: 'example@user.com' },
      { $set: updates },
      { new: true }
    );
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}