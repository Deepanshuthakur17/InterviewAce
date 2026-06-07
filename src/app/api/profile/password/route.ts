import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { hashPassword, verifyPassword } from '@/lib/hash';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing current or new password' }, { status: 400 });
    }

    const user = (await prisma.user.findUnique({
      where: { email: session.user.email }
    })) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user has a password set, verify it first
    if (user.password) {
      const isValid = verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
      }
    }

    // Hash the new password and update in database
    const hashedPassword = hashPassword(newPassword);
    await (prisma.user as any).update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
