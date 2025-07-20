import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
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
    const notifications = await Notification.find({ userId: decoded.id })
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: notifications.map(notif => ({
        id: notif._id,
        title: notif.title,
        message: notif.message,
        read: notif.read,
        createdAt: notif.createdAt
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    const { id } = params;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: decoded.id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      data: {
        id: notification._id,
        read: notification.read
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to mark notification as read', error: error.message },
      { status: 500 }
    );
  }
}