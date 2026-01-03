import { MongoClient, ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set in .env file');
    }

    console.log('🌱 Starting database seed...\n');

    const client = new MongoClient(databaseUrl);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');

        const db = client.db();

        // ==================== SUPERADMIN ====================
        const adminsCollection = db.collection('admins');
        const superadminEmail = 'admin@webticks.com';
        const superadminPassword = 'supersecret';

        const existingSuperadmin = await adminsCollection.findOne({ isSuperAdmin: true });

        if (existingSuperadmin) {
            console.log('✅ Superadmin already exists:', existingSuperadmin.email);
        } else {
            const passwordHash = await bcrypt.hash(superadminPassword, 10);
            const superadmin = await adminsCollection.insertOne({
                email: superadminEmail,
                passwordHash,
                isSuperAdmin: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Superadmin created:', superadminEmail);
            console.log('   Password:', superadminPassword);
        }

        // ==================== TEST USER ====================
        const usersCollection = db.collection('users');
        const testUserEmail = 'user@webticks.com';
        const testUserPassword = 'testpassword';

        let testUser = await usersCollection.findOne({ email: testUserEmail });

        if (testUser) {
            console.log('\n✅ Test user already exists:', testUser.email);
        } else {
            const passwordHash = await bcrypt.hash(testUserPassword, 10);
            const result = await usersCollection.insertOne({
                email: testUserEmail,
                passwordHash,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            testUser = await usersCollection.findOne({ _id: result.insertedId });
            console.log('\n✅ Test user created:', testUser!.email);
            console.log('   Password:', testUserPassword);
        }

        // ==================== APPLICATION & APP ID ====================
        const applicationsCollection = db.collection('applications');
        const existingApp = await applicationsCollection.findOne({ userId: testUser!._id });

        if (existingApp) {
            console.log('\n✅ Application already exists');
            console.log('   App ID:', existingApp.appId);
            console.log('   Name:', existingApp.name);
            console.log('   Domain:', existingApp.domain || 'N/A');
        } else {
            const appId = crypto.randomUUID();
            await applicationsCollection.insertOne({
                appId,
                name: 'Frontend Example App',
                domain: 'localhost:3000',
                userId: testUser!._id,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('\n✅ Application created');
            console.log('   App ID:', appId);
            console.log('   Name: Frontend Example App');
            console.log('   Domain: localhost:3000');
        }

        console.log('\n🎉 Database seeding completed!\n');
        console.log('📝 Use the App ID above in your frontend example');
        console.log('   Add it as the "webticks-app-id" header in your requests\n');

    } finally {
        await client.close();
    }
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    });
