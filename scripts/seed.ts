import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// Define schemas inline for the seed script
const AdminSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        isSuperAdmin: { type: Boolean, default: false },
    },
    { collection: 'admins', timestamps: true },
);

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
    },
    { collection: 'users', timestamps: true },
);

const ApplicationSchema = new mongoose.Schema(
    {
        appId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        domain: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { collection: 'applications', timestamps: true },
);

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Application = mongoose.model('Application', ApplicationSchema);

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('🌱 Starting database seed...\n');

    await mongoose.connect(databaseUrl);
    console.log('✅ Connected to MongoDB\n');

    // ==================== SUPERADMIN ====================
    const superadminEmail = 'admin@webticks.com';
    const superadminPassword = 'supersecret';

    const existingSuperadmin = await Admin.findOne({ isSuperAdmin: true });

    if (existingSuperadmin) {
        console.log('✅ Superadmin already exists:', existingSuperadmin.email);
    } else {
        const passwordHash = await bcrypt.hash(superadminPassword, 10);
        const superadmin = await Admin.create({
            email: superadminEmail,
            passwordHash,
            isSuperAdmin: true,
        });
        console.log('✅ Superadmin created:', superadmin.email);
        console.log('   Password:', superadminPassword);
    }

    // ==================== TEST USER ====================
    const testUserEmail = 'user@webticks.com';
    const testUserPassword = 'testpassword';

    let testUser = await User.findOne({ email: testUserEmail });

    if (testUser) {
        console.log('\n✅ Test user already exists:', testUser.email);
    } else {
        const passwordHash = await bcrypt.hash(testUserPassword, 10);
        testUser = await User.create({
            email: testUserEmail,
            passwordHash,
        });
        console.log('\n✅ Test user created:', testUser.email);
        console.log('   Password:', testUserPassword);
    }

    // ==================== APPLICATION & APP ID ====================
    const existingApp = await Application.findOne({ userId: testUser._id });

    if (existingApp) {
        console.log('\n✅ Application already exists');
        console.log('   App ID:', existingApp.appId);
        console.log('   Name:', existingApp.name);
        console.log('   Domain:', existingApp.domain || 'N/A');
    } else {
        const appId = crypto.randomUUID();
        const application = await Application.create({
            appId,
            name: 'Frontend Example App',
            domain: 'localhost:3000',
            userId: testUser._id,
        });
        console.log('\n✅ Application created');
        console.log('   App ID:', application.appId);
        console.log('   Name:', application.name);
        console.log('   Domain:', application.domain);
    }

    console.log('\n🎉 Database seeding completed!\n');
    console.log('📝 Use the App ID above in your frontend example');
    console.log('   Add it as the "webticks-app-id" header in your requests\n');

    await mongoose.disconnect();
}

main().catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
});
