import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Fetch real history items from Neon DB
  const history = await prisma.historyItem.findMany({
    where: { userId: user.id }
  });

  const totalInterviews = history.length;
  if (totalInterviews === 0) {
    return NextResponse.json({
      totalInterviews: 0,
      averageScore: 0,
      technicalAverage: 0,
      communicationAverage: 0,
      confidenceAverage: 0,
      totalHours: 0,
      weeklyProgress: [0, 0, 0, 0],
      strongTopics: [],
      weakTopics: []
    });
  }

  // Calculate real stats based on db history
  // For now, since HistoryItem model doesn't have detailed scores in schema, we will mock the sub-scores
  // based on completion, but use real interview counts.
  
  const totalSeconds = history.reduce((acc, item) => acc + item.durationSpent, 0);
  const totalHours = parseFloat((totalSeconds / 3600).toFixed(1));

  return NextResponse.json({
    totalInterviews,
    averageScore: 85, // Placeholder until schema is expanded with real scores
    technicalAverage: 82,
    communicationAverage: 88,
    confidenceAverage: 84,
    totalHours,
    weeklyProgress: [1, 2, totalInterviews > 2 ? totalInterviews - 2 : 1, totalInterviews],
    strongTopics: ['React', 'JavaScript'],
    weakTopics: ['System Design']
  });
}
