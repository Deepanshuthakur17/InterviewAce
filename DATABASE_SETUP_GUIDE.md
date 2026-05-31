# Moving from Mock Data to a Real Database

Your project is currently using a powerful mocked database (`src/lib/mockDb.ts`) that simulates network requests and persists data in your browser's LocalStorage. This is great for a fast UI, but to make it a true SaaS, you need to connect your own database.

I have already configured your `prisma/schema.prisma` and created a `.env.example` file for you. Follow these steps to make your app fully dynamic.

## Step 1: Get your Neon PostgreSQL Database
1. Go to [Neon.tech](https://neon.tech/) and click **Sign Up** (it's completely free).
2. Once logged in, click **Create a Project**. Name it `InterviewAce` and select a region close to you.
3. On your project dashboard, find the **Connection Details** box.
4. Click the dropdown that says "psql" and change it to **Prisma**.
5. Copy the connection string provided (it will look something like this):
   `postgresql://neondb_owner:xxxxxxxx@ep-cool-frost-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

## Step 2: Configure Your Environment
1. In the root of your `InterviewAce` project, create a new file named `.env`.
2. Copy the contents from `.env.example` into `.env`.
3. Replace the `DATABASE_URL` value with your actual connection string from Step 1.

## Step 3: Run Database Migrations
Now you need to push your Prisma schema (the `User` and `HistoryItem` tables) to your new database.
Open your terminal and run:
```bash
npx prisma db push
```
This will automatically create the tables in your PostgreSQL database!

## Step 4: Write Dynamic API Routes
Right now, your components fetch data using `mockDb.get()`. You need to replace these with real Next.js API Routes.

Here is an example of how you can create an API route to fetch your `User` profile dynamically from the database.

Create a new file at `src/app/api/profile/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';

export async function GET(request: Request) {
  // 1. Get the currently logged in user
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch the user from your REAL PostgreSQL database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  // 3. Return the dynamic data
  return NextResponse.json(user);
}
```

## Step 5: Update Your Frontend Components
Once your API route is ready, you can update your frontend components to fetch from your real API instead of `mockDb`.

For example, in a component using SWR:
```typescript
// Old static way:
// const { data } = useSWR('/api/profile', mockDb.get);

// New dynamic way:
const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data } = useSWR('/api/profile', fetcher);
```

By repeating Steps 4 and 5 for your `library`, `history`, and `bookmarks`, your application will be completely dynamic and production-ready!
