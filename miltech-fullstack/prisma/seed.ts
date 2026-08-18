import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@miltech.com' },
    update: {},
    create: {
      email: 'admin@miltech.com',
      name: 'Admin User',
      password: 'hashed_password_here',
      role: 'ADMIN',
    },
  })

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@miltech.com' },
    update: {},
    create: {
      email: 'user@miltech.com',
      name: 'Regular User',
      password: 'hashed_password_here',
      role: 'USER',
    },
  })

  // Create sample post
  const post = await prisma.post.create({
    data: {
      title: 'Welcome to MilTech',
      content: 'This is the first post on our platform.',
      published: true,
      authorId: admin.id,
    },
  })

  // Create sample comment
  const comment = await prisma.comment.create({
    data: {
      content: 'Great post! Looking forward to more content.',
      postId: post.id,
      authorId: user.id,
    },
  })

  console.log('Seed data created:')
  console.log('- Admin user:', admin.email)
  console.log('- Regular user:', user.email)
  console.log('- Sample post:', post.title)
  console.log('- Sample comment:', comment.content)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
