import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    // ==================== SUPERADMIN ====================
    const superadminEmail = 'admin@webticks.com';
    const superadminPassword = 'supersecret';

    const existingSuperadmin = await prisma.admin.findFirst({
        where: { isSuperAdmin: true },
    });

    if (existingSuperadmin) {
        console.log('✅ Superadmin already exists:', existingSuperadmin.email);
    } else {
        const passwordHash = await bcrypt.hash(superadminPassword, 10);
        const superadmin = await prisma.admin.create({
            data: {
                email: superadminEmail,
                passwordHash,
                isSuperAdmin: true,
            },
        });
        console.log('✅ Superadmin created:', superadmin.email);
        console.log('   Password:', superadminPassword);
    }

    // ==================== TEST USER ====================
    const testUserEmail = 'user@webticks.com';
    const testUserPassword = 'testpassword';

    let testUser = await prisma.user.findUnique({
        where: { email: testUserEmail },
    });

    if (testUser) {
        console.log('\n✅ Test user already exists:', testUser.email);
    } else {
        const passwordHash = await bcrypt.hash(testUserPassword, 10);
        testUser = await prisma.user.create({
            data: {
                email: testUserEmail,
                passwordHash,
            },
        });
        console.log('\n✅ Test user created:', testUser.email);
        console.log('   Password:', testUserPassword);
    }

    // ==================== APPLICATION & APP ID ====================
    const existingApp = await prisma.application.findFirst({
        where: {
            userId: testUser.id,
        },
    });

    if (existingApp) {
        console.log('\n✅ Application already exists');
        console.log('   App ID:', existingApp.appId);
        console.log('   Name:', existingApp.name);
        console.log('   Domain:', existingApp.domain || 'N/A');
    } else {
        const appId = crypto.randomUUID();
        const application = await prisma.application.create({
            data: {
                appId,
                name: 'Frontend Example App',
                domain: 'localhost:3000',
                userId: testUser.id,
            },
        });
        console.log('\n✅ Application created');
        console.log('   App ID:', application.appId);
        console.log('   Name:', application.name);
        console.log('   Domain:', application.domain);
    }

    console.log('\n🎉 Database seeding completed!\n');
    console.log('📝 Use the App ID above in your frontend example');
    console.log('   Add it as the "webticks-app-id" header in your requests\n');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

