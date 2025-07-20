import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Interview from '@/models/Interview';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const interviews = await Interview.find({ user: decoded.id })
      .populate({
        path: 'application',
        populate: {
          path: 'job',
          select: 'title'
        }
      })
      .sort({ date: 1 });

    // console.log("Backend interviews:", interviews);
    
    return NextResponse.json({ 
      success: true, 
      data: interviews.map(int => ({
        id: int._id,
        jobTitle: int.application?.job?.title,
        date: int.date,
        type: int.type,
        status: int.status,
        interviewerName: int.interviewerName,
        interviewerEmail: int.interviewerEmail,
        location: int.location,
        meetingLink: int.meetingLink,
        notes: int.notes
      }))
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch interviews', error: error.message },
      { status: 500 }
    );
  }
}