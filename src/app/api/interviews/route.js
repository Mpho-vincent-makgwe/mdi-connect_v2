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
    const interviews = await Interview.find({ userId: decoded.id })
      .populate('applicationId', 'jobTitle');
    
    return NextResponse.json({ 
      success: true, 
      data: interviews.map(int => ({
        id: int._id,
        jobTitle: int.applicationId?.jobTitle,
        date: int.date,
        type: int.type,
        status: int.status,
        interviewerName: int.interviewerName,
        notes: int.notes
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch interviews', error: error.message },
      { status: 500 }
    );
  }
}