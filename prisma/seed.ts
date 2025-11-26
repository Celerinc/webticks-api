import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const superadminEmail = 'admin@webticks.com';
    const superadminPassword = 'supersecret';

    // Check if superadmin already exists
    const existingSuperadmin = await prisma.admin.findFirst({
        where: { isSuperAdmin: true },
    });

    if (existingSuperadmin) {
        console.log('✅ Superadmin already exists');
        return;
    }

    // Create superadmin
    const passwordHash = await bcrypt.hash(superadminPassword, 10);
    const superadmin = await prisma.admin.create({
        data: {
            email: superadminEmail,
            passwordHash,
            isSuperAdmin: true,
        },
    });

    console.log('✅ Superadmin created:', superadmin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
