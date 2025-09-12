import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { invitationToken, email, oldPassword, role, newPassword } = await request.json();
    console.log('Received data:', { email, hasOldPassword: !!oldPassword, hasNewPassword: !!newPassword, role });

    // Validate required fields
    if (!email || !oldPassword || !newPassword) {
      console.log('Missing required fields');
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find user by email - explicitly include temporaryPassword
    const user = await User.findOne({ email }).select('+temporaryPassword');
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 400 }
      );
    }

    console.log('User found:', user.email);
    console.log('Has temporary password:', !!user.temporaryPassword);
    console.log('Is temporary password flag:', user.isTemporaryPassword);
    console.log('User object:', JSON.stringify(user, null, 2));
    console.log("Input old password:", oldPassword);
    console.log("Stored temporary password:", user.temporaryPassword);

    // Check if user has a temporary password and it matches
    let isPasswordValid = false;
    
    if (user.temporaryPassword && user.isTemporaryPassword) {
      // Compare with stored temporary password (plain text)
      isPasswordValid = oldPassword === user.temporaryPassword;
      console.log("Temporary password match result:", isPasswordValid);
    }
    
    // If temporary password didn't match or doesn't exist, try bcrypt with the actual password
    if (!isPasswordValid && user.password) {
      isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      console.log("Hashed password match result:", isPasswordValid);
    }
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { success: false, message: 'Invalid temporary password' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user with new password and mark as active
    user.password = hashedPassword;
    user.role = role || user.role;
    user.isActive = true;
    user.invitationToken = undefined;
    user.invitationExpires = undefined;
    user.temporaryPassword = undefined; // Remove temporary password
    user.isTemporaryPassword = false;   // Remove temporary flag
    user.completedQuestionnaire = false; // Reset questionnaire status

    await user.save();
    console.log('User updated successfully:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    const userData = user.toObject();
    delete userData.password;
    delete userData.temporaryPassword;

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Complete registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}