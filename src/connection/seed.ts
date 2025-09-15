import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPasswordJohan = await bcrypt.hash("123456", 10);
  const hashedPasswordTenma = await bcrypt.hash("123456", 10);

  const johan = await prisma.user.create({
    data: {
      username: "monster",
      full_name: "Johan Liebert",
      email: "johan@gmail.com",
      password: hashedPasswordJohan,
      photo_profile: "http://localhost:3000/images/Tenma.jpg",
      bio: "Life is not fair. It never was, and it never will be.",
    },
  });

  const tenma = await prisma.user.create({
    data: {
      username: "Dr. Tenma",
      full_name: "Kenzo Tenma",
      email: "tenma@gmail.com",
      password: hashedPasswordTenma,
      photo_profile: "http://localhost:3000/images/Johan.jpeg",
      bio: "Even if you can forget, you can't erase the past.",
    },
  });

  await prisma.following.create({
    data: {
      following_id: tenma.id,
      follower_id: johan.id,
    },
  });

  const thread1 = await prisma.thread.create({
    data: {
      content:
        "The human heart is a strange vessel. Love and hatred can exist side by side.",
      image: null,
      created_by: johan.id,
    },
  });

  const thread2 = await prisma.thread.create({
    data: {
      content:
        "If you dont have any happy memories you can just make some. You can just make some from now on",
      image: null,
      created_by: tenma.id,
    },
  });

  await prisma.reply.create({
    data: {
      user_id: tenma.id,
      thread_id: thread1.id,
      content: "Where are you?",
      created_by: tenma.id,
    },
  });

  await prisma.like.create({
    data: {
      user_id: johan.id,
      thread_id: thread2.id,
      created_by: johan.id,
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
