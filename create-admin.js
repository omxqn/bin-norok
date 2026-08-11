// Local development helper: create or reset a SUPER_ADMIN account.
//
// Credentials come from the environment. They used to be hardcoded here, and
// this script SILENTLY OVERWRITES the password of an existing account — so a
// copy shipped to a server was a one-command super-admin takeover.
//
// Usage:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' node create-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const HASH_ROUNDS = 12;

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to run in production. Manage admins through the dashboard.');
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD.');
  }

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
  }

  const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
    create: {
      name: 'Museum Admin',
      email: email,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Admin user created/updated:', admin.email);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
