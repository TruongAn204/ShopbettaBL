/**
 * Product API Service
 * Interacts with NestJS backend /products endpoints
 */

import { apiClient } from './client.js';

// Fallback mock items when backend is offline
export const MOCK_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Cá Betta Halfmoon Dumbo Lavender Siêu Phẩm',
    slug: 'betta-halfmoon-dumbo-lavender',
    category: 'Betta Halfmoon',
    categoryId: 'cat_halfmoon',
    price: 350000,
    originalPrice: 420000,
    stock: 12,
    rating: 4.9,
    reviewCount: 38,
    isFeatured: true,
    images: [
      'https://bettasales.net/wp-content/uploads/2017/04/11009874_460640844116386_2597940959999715225_n.jpg',
      'https://images.unsplash.com/photo-1576836165612-8bc9b07e7778?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Cá Betta Halfmoon tai to Dumbo với sắc tím Lavender tuyệt đẹp, đuôi xòe tròn chuẩn 180 độ. Dòng cá tuyển chọn chất lượng cao từ Bạc Liêu.',
  },
  {
    id: 'prod_2',
    name: 'Betta Koi Galaxy Multi Color Đỉnh Cao',
    slug: 'betta-koi-galaxy-multi-color',
    category: 'Betta Plakat (PK)',
    categoryId: 'cat_plakat',
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
    id: 'prod_3',
    name: 'Betta Black Samurai Plakat Chuẩn Form Thi Đấu',
    slug: 'betta-black-samurai-plakat',
    category: 'Betta Plakat (PK)',
    categoryId: 'cat_plakat',
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
    id: 'prod_4',
    name: 'Betta Crowntail Đuôi Vương Miện King Crown Đỏ Rực',
    slug: 'betta-crowntail-king-crown-red',
    category: 'Betta Crowntail',
    categoryId: 'cat_crowntail',
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
    id: 'prod_5',
    name: 'Betta Super White Halfmoon Bạch Mã Hoàng Tử',
    slug: 'betta-super-white-halfmoon',
    category: 'Betta Halfmoon',
    categoryId: 'cat_halfmoon',
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
    id: 'prod_6',
    name: 'Betta Alien Green Wild Type Hoang Dã Quý Hiếm',
    slug: 'betta-alien-green-wild-type',
    category: 'Betta Wild / Alien',
    categoryId: 'cat_wild',
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
    id: 'prod_7',
    name: 'Hồ Kính Dán Giấu Keo Siêu Trong 20x20x20 (cm)',
    slug: 'ho-kinh-sieu-trong-20-20-20',
    category: 'Hồ & Phụ kiện',
    categoryId: 'cat_accessories',
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
    id: 'prod_8',
    name: 'Thức Ăn Hạt Chìm Betta Bio-Gold Hikari Nhật Bản 20g',
    slug: 'thuc-an-betta-bio-gold-hikari',
    category: 'Thức ăn dinh dưỡng',
    categoryId: 'cat_food',
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

export const MOCK_CATEGORIES = [
  { id: 'cat_halfmoon', name: 'Betta Halfmoon', count: 18, icon: '🐟' },
  { id: 'cat_plakat', name: 'Betta Plakat (PK)', count: 24, icon: '⚔️' },
  { id: 'cat_crowntail', name: 'Betta Crowntail', count: 12, icon: '👑' },
  { id: 'cat_wild', name: 'Betta Wild / Alien', count: 9, icon: '🌿' },
  { id: 'cat_food', name: 'Thức ăn dinh dưỡng', count: 15, icon: '🦐' },
  { id: 'cat_accessories', name: 'Hồ & Phụ kiện', count: 30, icon: '🫧' },
];

export const productApi = {
  /**
   * Get list of products with optional query params (search, category, minPrice, maxPrice, sort, page)
   * @param {Object} query 
   */
  async getProducts(query = {}) {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(query).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      });
      const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return await apiClient(`/products${queryString}`);
    } catch {
      // Mock filtering fallback
      let list = [...MOCK_PRODUCTS];
      if (query.search) {
        const s = query.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
      }
      if (query.category) {
        list = list.filter((p) => p.categoryId === query.category || p.category === query.category);
      }
      if (query.minPrice) {
        list = list.filter((p) => p.price >= Number(query.minPrice));
      }
      if (query.maxPrice) {
        list = list.filter((p) => p.price <= Number(query.maxPrice));
      }
      if (query.sort === 'price-asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (query.sort === 'price-desc') {
        list.sort((a, b) => b.price - a.price);
      } else if (query.sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      }
      return { items: list, total: list.length, page: 1, limit: 12 };
    }
  },

  /**
   * Get single product by id or slug
   * @param {string} idOrSlug 
   */
  async getProductById(idOrSlug) {
    try {
      return await apiClient(`/products/${idOrSlug}`);
    } catch {
      const found = MOCK_PRODUCTS.find(
        (p) => String(p.id) === String(idOrSlug) || p.slug === idOrSlug
      );
      if (found) return found;
      return MOCK_PRODUCTS[0];
    }
  },

  /**
   * Get featured products for home page
   */
  async getFeaturedProducts() {
    try {
      return await apiClient('/products/featured');
    } catch {
      return MOCK_PRODUCTS.filter((p) => p.isFeatured);
    }
  },

  /**
   * Get category list
   */
  async getCategories() {
    try {
      return await apiClient('/products/categories');
    } catch {
      return MOCK_CATEGORIES;
    }
  },
};
