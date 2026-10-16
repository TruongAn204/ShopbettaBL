import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Shop Betta BL...');

  // Clean existing tables (in order of relations)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('Admin@123456', saltRounds);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', saltRounds);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@betta.vn',
      password: adminPasswordHash,
      fullName: 'Quản Trị Viên Betta BL',
      phone: '0988123456',
      address: '128 Đường Hòa Bình, Phường 3, TP. Bạc Liêu',
      role: Role.ADMIN,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'khachhang@gmail.com',
      password: customerPasswordHash,
      fullName: 'Nguyễn Văn Khách',
      phone: '0912345678',
      address: 'Phường 7, TP. Bạc Liêu, Tỉnh Bạc Liêu',
      role: Role.CUSTOMER,
    },
  });

  console.log(`✅ Seeded users: Admin (${adminUser.email}), Customer (${customerUser.email})`);

  // 2. Seed Categories
  const catHalfmoon = await prisma.category.create({
    data: {
      name: 'Betta Halfmoon',
      slug: 'betta-halfmoon',
      description: 'Dòng cá Betta đuôi xòe tròn chuẩn 180 độ hình bán nguyệt kiêu sa lộng lẫy.',
      icon: '🐟',
    },
  });

  const catPlakat = await prisma.category.create({
    data: {
      name: 'Betta Plakat (PK)',
      slug: 'betta-plakat',
      description: 'Dòng cá đuôi ngắn dũng mãnh, kè sung, vảy rồng và vảy ánh kim tuyến.',
      icon: '⚔️',
    },
  });

  const catCrowntail = await prisma.category.create({
    data: {
      name: 'Betta Crowntail',
      slug: 'betta-crowntail',
      description: 'Đuôi tưa vương miện hoàng gia đầy cá tính và cuốn hút.',
      icon: '👑',
    },
  });

  const catWild = await prisma.category.create({
    data: {
      name: 'Betta Wild / Alien',
      slug: 'betta-wild-alien',
      description: 'Dòng Betta hoang dã và Alien phát quang với sức đề kháng cực cao.',
      icon: '🌿',
    },
  });

  const catFood = await prisma.category.create({
    data: {
      name: 'Thức ăn dinh dưỡng',
      slug: 'thuc-an-dinh-duong',
      description: 'Cám viên tăng màu, artemia ấp nở và thức ăn đông khô dinh dưỡng.',
      icon: '🦐',
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Hồ & Phụ kiện',
      slug: 'ho-phu-kien',
      description: 'Hồ kính siêu trong, sủi oxy, lá bàng dưỡng cá và vợt bắt cá mềm.',
      icon: '🫧',
    },
  });

  console.log('✅ Seeded categories.');

  // 3. Seed Products
  const productsData = [
    {
      name: 'Cá Betta Halfmoon Dumbo Lavender Siêu Phẩm',
      slug: 'betta-halfmoon-dumbo-lavender',
      categoryId: catHalfmoon.id,
      price: 350000,
      originalPrice: 420000,
      stock: 12,
      rating: 4.9,
      reviewCount: 38,
      isFeatured: true,
      images: [
        'https://bettasales.net/wp-content/uploads/2017/04/11009874_460640844116386_2597940959999715225_n.jpg',
      ],
      description: 'Cá Betta Halfmoon tai to Dumbo với sắc tím Lavender tuyệt đẹp, đuôi xòe tròn chuẩn 180 độ. Dòng cá tuyển chọn chất lượng cao từ Bạc Liêu.',
    },
    {
      name: 'Betta Koi Galaxy Multi Color Đỉnh Cao',
      slug: 'betta-koi-galaxy-multi-color',
      categoryId: catPlakat.id,
      price: 280000,
      originalPrice: 350000,
      stock: 25,
      rating: 5.0,
      reviewCount: 64,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Betta Plakat Koi Galaxy vảy kim tuyến lấp lánh như vũ trụ. Dòng cá lực lưỡng, bơi khỏe, kè sung mãn thích hợp sưu tầm và lai tạo.',
    },
    {
      name: 'Betta Black Samurai Plakat Chuẩn Form Thi Đấu',
      slug: 'betta-black-samurai-plakat',
      categoryId: catPlakat.id,
      price: 450000,
      originalPrice: 550000,
      stock: 8,
      rating: 4.8,
      reviewCount: 29,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Chiến binh Samurai giáp vảy rồng bạc sáng chói trên nền da đen tuyền huyền bí. Thần thái uy nghiêm, form vây đều tăm tắp.',
    },
    {
      name: 'Betta Crowntail Đuôi Vương Miện King Crown Đỏ Rực',
      slug: 'betta-crowntail-king-crown-red',
      categoryId: catCrowntail.id,
      price: 220000,
      originalPrice: 280000,
      stock: 18,
      rating: 4.7,
      reviewCount: 19,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Đuôi tưa vương miện hoàng gia với sắc đỏ rực rỡ tượng trưng cho may mắn tài lộc. Thích hợp trưng bày phong thủy bàn làm việc.',
    },
    {
      name: 'Betta Super White Halfmoon Bạch Mã Hoàng Tử',
      slug: 'betta-super-white-halfmoon',
      categoryId: catHalfmoon.id,
      price: 320000,
      originalPrice: 380000,
      stock: 15,
      rating: 4.9,
      reviewCount: 42,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Toàn thân trắng tinh khôi không tì vết, các nan vây xòe nhẹ nhàng như lụa. Dòng cá quý phái rất được yêu thích tại Shop Betta BL.',
    },
    {
      name: 'Betta Alien Green Wild Type Hoang Dã Quý Hiếm',
      slug: 'betta-alien-green-wild-type',
      categoryId: catWild.id,
      price: 390000,
      originalPrice: 480000,
      stock: 7,
      rating: 5.0,
      reviewCount: 15,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Dòng cá Betta Alien lai tạo từ cá hoang dã với ánh xanh ngọc lục bảo phát sáng trong đêm. Thể lực siêu dẻo dai và sống rất thọ.',
    },
    {
      name: 'Hồ Kính Dán Giấu Keo Siêu Trong 20x20x20 (cm)',
      slug: 'ho-kinh-sieu-trong-20-20-20',
      categoryId: catAccessories.id,
      price: 160000,
      originalPrice: 200000,
      stock: 40,
      rating: 4.8,
      reviewCount: 52,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Hồ kính siêu trong 5mm mài vi tính, dán giấu keo thẩm mỹ cao cấp. Kích thước chuẩn phong thủy để bàn ngắm cá Betta.',
    },
    {
      name: 'Thức Ăn Hạt Chìm Betta Bio-Gold Hikari Nhật Bản 20g',
      slug: 'thuc-an-betta-bio-gold-hikari',
      categoryId: catFood.id,
      price: 85000,
      originalPrice: 110000,
      stock: 120,
      rating: 4.9,
      reviewCount: 110,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
      ],
      description: 'Cám hạt chuyên dụng giúp cá Betta lên màu tự nhiên, tăng sức đề kháng và không gây đục nước hồ nuôi.',
    },
  ];

  for (const item of productsData) {
    await prisma.product.create({ data: item });
  }

  console.log(`✅ Seeded ${productsData.length} products successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
