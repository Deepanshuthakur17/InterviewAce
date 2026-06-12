import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dns from 'dns'

// Force Node.js to prefer IPv4 over IPv6 when resolving database hostnames
dns.setDefaultResultOrder('ipv4first')

const connectionString = `${process.env.DATABASE_URL}`

const prismaClientSingleton = () => {
  const pool = new Pool({ 
    connectionString,
    max: 10,
    idleTimeoutMillis: 10000, // Close idle connections after 10 seconds to help serverless databases
    connectionTimeoutMillis: 5000, // Timeout after 5 seconds if connection fails
    maxUses: 100 // Re-create connection after 100 queries
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
