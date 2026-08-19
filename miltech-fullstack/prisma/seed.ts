import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

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

  // Create regular user (seller)
  const seller = await prisma.user.upsert({
    where: { email: 'seller@miltech.com' },
    update: {},
    create: {
      email: 'seller@miltech.com',
      name: 'Military Seller',
      password: 'hashed_password_here',
      role: 'USER',
    },
  })

  // Create buyer user
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@miltech.com' },
    update: {},
    create: {
      email: 'buyer@miltech.com',
      name: 'Regular Buyer',
      password: 'hashed_password_here',
      role: 'USER',
    },
  })

  // Create sample listing
  const listing = await prisma.listing.create({
    data: {
      title: 'T-72B3 Main Battle Tank',
      description: 'Modernized main battle tank with improved armor and fire control system. Excellent condition, ready for deployment.',
      category: 'tanks',
      price: 2500000,
      location: 'Moscow, Russia',
      latitude: 55.7558,
      longitude: 37.6173,
      status: 'ACTIVE',
      year: 2018,
      combatWeight: 46.5,
      country: 'Russia',
      imageUrl: 'https://images.unsplash.com/photo-1599307767316-77f6b9d3d8c7?w=800',
      attributes: {
        engine_power: '1130 hp',
        max_speed: '60 km/h',
        range: '500 km',
        crew: 3,
        main_gun: '125mm 2A46M-5',
        armor_type: 'Composite + ERA',
      },
      has3D: true,
      hasBlueprint: false,
      compatible: ['T-90 turret', 'Kontakt-5 ERA', 'Relikt ERA'],
      sellerId: seller.id,
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
      authorId: buyer.id,
    },
  })

  console.log('Seed data created:')
  console.log('- Admin user:', admin.email)
  console.log('- Seller user:', seller.email, '(ID:', seller.id + ')')
  console.log('- Buyer user:', buyer.email, '(ID:', buyer.id + ')')
  console.log('- Sample listing:', listing.title, '(ID:', listing.id + ')')
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
