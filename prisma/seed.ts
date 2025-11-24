import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create initial admin user
  const email = 'admin@example.com';
  const password = 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

