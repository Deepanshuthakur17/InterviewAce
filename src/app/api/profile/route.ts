import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  return NextResponse.json(user || {});
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: body.name !== undefined ? body.name : undefined,
      avatar: body.avatar !== undefined ? body.avatar : undefined,
      careerGoals: body.careerGoals !== undefined ? body.careerGoals : undefined,
      skills: body.skills !== undefined ? body.skills : undefined,
      resumeName: body.resumeName !== undefined ? body.resumeName : undefined,
      resumeParsedSkills: body.resumeParsedSkills !== undefined ? body.resumeParsedSkills : undefined,
    }
  });

  return NextResponse.json(user);
}
