import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Mulai menambahkan data sample...')

  // Tambahkan Brand
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Toyota' } }),
    prisma.brand.create({ data: { name: 'Honda' } }),
    prisma.brand.create({ data: { name: 'Suzuki' } }),
    prisma.brand.create({ data: { name: 'Mitsubishi' } }),
  ])
  console.log('✅ Brand berhasil ditambahkan!')

  // Tambahkan Cars
  const cars = await Promise.all([
    prisma.car.create({
      data: {
        name: 'Toyota Avanza Veloz',
        brandId: brands[0].id,
        model: 'Veloz 1.5',
        year: 2020,
        price: 155000000,
        kilometer: 45000,
        color: 'Putih',
        plateNumber: 'BK 1234 AB',
        transmission: 'Automatic',
        fuelType: 'Bensin',
        engineCapacity: '1500 cc',
        description: 'Mobil keluarga yang nyaman dan irit bahan bakar. Mesin sehat, body mulus, servis rutin di bengkel resmi Toyota.',
        status: 'Ready',
        featured: true,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542361345-81d90cc0d113?w=800',
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        ]),
      },
    }),
    prisma.car.create({
      data: {
        name: 'Honda CR-V Turbo',
        brandId: brands[1].id,
        model: '1.5 Turbo Prestige',
        year: 2021,
        price: 385000000,
        kilometer: 32000,
        color: 'Hitam',
        plateNumber: 'BK 5678 CD',
        transmission: 'Automatic',
        fuelType: 'Bensin',
        engineCapacity: '1500 cc Turbo',
        description: 'SUV premium dengan fitur lengkap. Sunroof, leather seat, kamera 360, dan masih banyak lagi.',
        status: 'Ready',
        featured: true,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606610990978-862219009d9e?w=800',
          'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
        ]),
      },
    }),
    prisma.car.create({
      data: {
        name: 'Suzuki Ertiga',
        brandId: brands[2].id,
        model: 'GX AT',
        year: 2019,
        price: 125000000,
        kilometer: 58000,
        color: 'Silver',
        plateNumber: 'BK 9012 EF',
        transmission: 'Automatic',
        fuelType: 'Bensin',
        engineCapacity: '1400 cc',
        description: 'MPV compact yang cocok untuk keluarga. Perawatan mudah dan irit bahan bakar.',
        status: 'Ready',
        featured: false,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800',
        ]),
      },
    }),
  ])
  console.log('✅ Mobil berhasil ditambahkan!')

  // Tambahkan Testimonials
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Andi Wijaya',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        content: 'Pelayanan sangat baik, mobil yang saya beli sesuai dengan ekspektasi. Highly recommended!',
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Siti Nurhaliza',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
        content: 'Harga kompetitif dan kualitas mobilnya terjamin. Pak Bosnya ramah banget!',
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Rizky Pratama',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        content: 'Sudah beli 2 mobil disini. Semua sesuai deskripsi dan proses cepat. Sukses terus!',
      },
    }),
  ])
  console.log('✅ Testimonial berhasil ditambahkan!')

  console.log('🎉 Semua data sample berhasil ditambahkan!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
