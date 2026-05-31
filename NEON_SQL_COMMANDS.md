# InterviewAce Neon Database SQL Commands

Because we are using **Prisma**, you technically don't *have* to run any of these manually! Running `npx prisma db push` automatically runs these exact SQL commands under the hood. 

However, if you ever want to build your tables manually in the Neon SQL Editor, reset your database, or query your data, here are all the SQL commands for your SaaS platform.

---

## 1. Create Tables (DDL)
Run these commands to manually create your application's architecture in Neon.

### Create the User Table
```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "skills" TEXT[],
    "careerGoals" TEXT,
    "resumeName" TEXT,
    "resumeParsedSkills" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Ensure emails are unique
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

### Create the HistoryItem Table
```sql
CREATE TABLE "HistoryItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "durationSpent" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "answeredQuestions" INTEGER NOT NULL,

    CONSTRAINT "HistoryItem_pkey" PRIMARY KEY ("id")
);

-- (Optional) Add a foreign key constraint to link History to Users
ALTER TABLE "HistoryItem" ADD CONSTRAINT "HistoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 2. Insert Dummy Data (DML)
If you want to manually inject mock data to see how it looks on your Dashboard.

### Insert a Mock User
```sql
INSERT INTO "User" ("id", "name", "email", "avatar", "skills", "resumeParsedSkills") 
VALUES (
  'user-123', 
  'Alex Mercer', 
  'alex@interviewace.ai', 
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
  ARRAY['React', 'Next.js', 'Tailwind'], 
  ARRAY['JavaScript', 'TypeScript']
);
```

### Insert a Mock Interview History
```sql
INSERT INTO "HistoryItem" ("id", "userId", "roleId", "roleTitle", "date", "durationSpent", "totalQuestions", "answeredQuestions")
VALUES (
  'hist-123', 
  'user-123', 
  'frontend-dev', 
  'Frontend Developer', 
  '2026-05-31', 
  900, 
  5, 
  4
);
```

---

## 3. Querying Your Data (DQL)
Useful commands to check what's going on inside your SaaS.

**Get all users:**
```sql
SELECT * FROM "User";
```

**Find a specific user by email:**
```sql
SELECT * FROM "User" WHERE email = 'alex@interviewace.ai';
```

**See all interviews completed by a specific user:**
```sql
SELECT * FROM "HistoryItem" WHERE "userId" = 'user-123';
```

**Get a user's total practice duration (in seconds):**
```sql
SELECT "userId", SUM("durationSpent") as "total_seconds_practiced" 
FROM "HistoryItem" 
GROUP BY "userId";
```

---

## 4. Resetting Your Database (Danger Zone)
If you want to completely wipe out your tables and start over from scratch, run these commands:

```sql
DROP TABLE IF EXISTS "HistoryItem";
DROP TABLE IF EXISTS "User";
```
