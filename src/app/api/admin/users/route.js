import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
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
    
    // Check if user is admin
    const user = await User.findById(decoded.id);
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean() // Add this to get plain JavaScript objects
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Manually add application count
    const usersWithApplicationCount = users.map(user => ({
      ...user,
      applicationCount: user.applications?.length || 0
    }));

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      success: true,
      data: {
        users,
        totalUsers,
        totalPages,
        currentPage: page
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    );
  }
}