# 🐟 Shop Betta BL - Hệ Thống E-Commerce Toàn Diện

Dự án website thương mại điện tử chuyên cung cấp cá cảnh Betta và phụ kiện thủy sinh cao cấp, được thiết kế theo kiến trúc chuẩn mực: **Frontend (HTML/CSS/JS thuần)** kết hợp cùng **Backend (NestJS + TypeScript + PostgreSQL + Prisma ORM)** và môi trường **Docker Compose**.

---

## 📁 Cấu Trúc Dự Án (Project Structure)

```text
ecommerce-project/
├── docker-compose.yml          # Chạy PostgreSQL, Redis và pgAdmin cục bộ
├── .gitignore
├── README.md
│
├── frontend/                   # Client-side (HTML, CSS, JavaScript thuần)
│   ├── index.html              # Trang chủ bán hàng (hero banner, sản phẩm nổi bật)
│   ├── products.html           # Trang danh sách sản phẩm & bộ lọc
│   ├── product-detail.html     # Trang chi tiết sản phẩm
│   ├── cart.html               # Trang giỏ hàng
│   ├── checkout.html           # Trang thanh toán & đặt hàng
│   ├── login.html              # Đăng nhập / Đăng ký
│   │
│   ├── css/                    # Stylesheets
│   │   ├── base.css            # Reset CSS, biến màu sắc, typography (font chữ)
│   │   ├── layout.css          # Header, footer, grid hệ thống, sidebar
│   │   ├── components.css      # Nút bấm, thẻ sản phẩm (card), input, modal, toast
│   │   └── pages/              # Style riêng cho từng trang
│   │       ├── home.css
│   │       ├── product.css
│   │       └── cart.css
│   │
│   ├── js/                     # Client logic & DOM interactions
│   │   ├── api/                # Hàm gọi HTTP sang NestJS backend
│   │   │   ├── client.js       # Cấu hình hàm `fetch` gốc (tự đính kèm JWT token)
│   │   │   ├── auth.api.js     # Gọi login, register, profile
│   │   │   ├── product.api.js  # Lấy danh sách, chi tiết sản phẩm
│   │   │   └── order.api.js    # Gửi yêu cầu đặt hàng
│   │   ├── utils/              # Hàm hỗ trợ
│   │   │   ├── formatters.js   # Format tiền tệ (VND), định dạng ngày tháng
│   │   │   └── storage.js      # Lưu/đọc LocalStorage (giỏ hàng tạm, token)
│   │   ├── components/         # Render dynamic HTML (Header auth, Cart icon badge)
│   │   │   ├── header.js
│   │   │   ├── toast.js
│   │   │   └── product-card.js
│   │   └── pages/              # Script điều khiển từng trang
│   │       ├── home.js
│   │       ├── products.js
│   │       ├── product-detail.js
│   │       ├── cart.js
│   │       └── checkout.js
│   │
│   └── assets/                 # Tài nguyên tĩnh
│       ├── images/             # Banner, logo, placeholder
│       └── icons/              # SVG icons
│
└── backend/                    # Server-side (NestJS + PostgreSQL)
    ├── src/
    │   ├── main.ts             # Entry point (kích hoạt CORS, Global Validation Pipe)
    │   ├── app.module.ts       # Module gốc gom tất cả feature modules
    │   │
    │   ├── common/             # Dùng chung toàn backend
    │   │   ├── decorators/     # Custom decorators (@CurrentUser, @Roles, @Public)
    │   │   ├── filters/        # Bắt lỗi toàn cục (HttpExceptionFilter)
    │   │   ├── guards/         # Bảo vệ route (JwtAuthGuard, RolesGuard)
    │   │   └── interceptors/   # Chuẩn hóa format phản hồi JSON (TransformInterceptor)
    │   │
    │   ├── config/             # Đọc và validate biến môi trường (.env)
    │   │   └── configuration.ts
    │   │
    │   ├── database/           # Quản lý kết nối PostgreSQL & Migration
    │   │   ├── prisma/
    │   │   │   └── schema.prisma   # Định nghĩa models (User, Category, Product, CartItem, Order, OrderItem)
    │   │   ├── prisma.service.ts
    │   │   ├── prisma.module.ts
    │   │   └── seeds/          # Script tạo dữ liệu mẫu (sản phẩm test, tài khoản admin)
    │   │       └── seed.ts
    │   │
    │   └── modules/            # Các tính năng nghiệp vụ (Domain Modules)
    │       ├── auth/           # Xác thực & Phân quyền
    │       │   ├── auth.controller.ts
    │       │   ├── auth.service.ts
    │       │   ├── auth.module.ts
    │       │   ├── strategies/ # JwtStrategy, LocalStrategy (Passport)
    │       │   └── dto/        # Data Transfer Objects (LoginDto, RegisterDto)
    │       │
    │       ├── users/          # Quản lý tài khoản
    │       │   ├── users.controller.ts
    │       │   ├── users.service.ts
    │       │   └── users.module.ts
    │       │
    │       ├── products/       # Danh mục & Sản phẩm
    │       │   ├── products.controller.ts
    │       │   ├── products.service.ts
    │       │   ├── products.module.ts
    │       │   └── dto/        # CreateProductDto, QueryProductDto (phân trang, lọc giá)
    │       │
    │       ├── cart/           # Quản lý giỏ hàng phía server
    │       │   ├── cart.controller.ts
    │       │   ├── cart.service.ts
    │       │   └── cart.module.ts
    │       │
    │       └── orders/         # Đặt hàng & Xử lý thanh toán
    │           ├── orders.controller.ts
    │           ├── orders.service.ts
    │           ├── orders.module.ts
    │           └── dto/        # CreateOrderDto (địa chỉ nhận, danh sách item, phương thức)
    │
    ├── test/                   # E2E & Unit tests
    ├── .env                    # Biến môi trường kết nối database
    ├── .env.example
    ├── nest-cli.json
    ├── tsconfig.json
    └── package.json
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Khởi Động PostgreSQL qua Docker Compose
Mở terminal tại thư mục gốc và chạy:
```bash
docker compose up -d
```
Lệnh này sẽ khởi chạy:
- **PostgreSQL 16**: Cổng `5432` (User: `postgres`, Password: `postgres`, Database: `shop_db`)
- **pgAdmin 4**: Truy cập tại `http://localhost:5050` (Email: `admin@betta.vn`, Password: `Admin@123456`)
- **Redis 7**: Cổng `6379`

### Bước 2: Khởi Động Backend NestJS
Mở terminal tại thư mục `backend/`:
```bash
cd backend
npm install
```

Sinh mã nguồn Prisma Client và khởi tạo cấu trúc bảng:
```bash
npm run prisma:generate
npm run prisma:migrate
```

Chạy script tạo dữ liệu mẫu (Sản phẩm Betta, Danh mục, Tài khoản Admin & Khách hàng):
```bash
npm run prisma:seed
```

Khởi chạy máy chủ Backend ở chế độ phát triển:
```bash
npm run start:dev
```
Máy chủ API NestJS sẽ chạy tại: **`http://localhost:3000/api`**

### Bước 3: Khởi Động Giao Diện Frontend
Frontend được viết hoàn toàn bằng **HTML, CSS và JavaScript thuần (ES6 Modules)**, bạn có thể:
1. Mở trực tiếp bằng extension **Live Server** trong VS Code / Antigravity IDE (chuột phải vào `frontend/index.html` chọn **Open with Live Server**).
2. Hoặc sử dụng bất kỳ http server tĩnh nào:
```bash
cd frontend
npx -y serve . -p 5500
```
Truy cập: **`http://localhost:5500`**

> 💡 **Tính năng Offline Fallback:** Frontend được tích hợp sẵn mock data thông minh. Ngay cả khi chưa bật server backend, bạn vẫn có thể trải nghiệm đầy đủ giao diện, tìm kiếm, lọc danh mục, thêm vào giỏ hàng, xem chi tiết và thử đặt hàng! Khi bật backend NestJS lên, hệ thống sẽ tự động gọi trực tiếp vào REST API.

---

## 👥 Tài Khoản Mẫu (Demo Credentials)

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@betta.vn` | `Admin@123456` |
| **Khách hàng (Customer)** | `khachhang@gmail.com` | `Customer@123456` |

---

## 📡 Danh Sách API Endpoints (NestJS RESTful API)

### 1. Xác thực & Tài khoản (`/api/auth`, `/api/users`)
- `POST /api/auth/register` : Đăng ký tài khoản khách hàng mới.
- `POST /api/auth/login` : Đăng nhập & nhận chuỗi Bearer JWT Token.
- `GET /api/auth/profile` : Lấy thông tin người dùng đang đăng nhập.
- `GET /api/users/me` : Lấy hồ sơ người dùng.
- `PUT /api/users/me` : Cập nhật họ tên, số điện thoại, địa chỉ nhận cá.

### 2. Danh mục & Sản phẩm (`/api/products`)
- `GET /api/products` : Lấy danh sách sản phẩm (hỗ trợ lọc `search`, `category`, `minPrice`, `maxPrice`, sắp xếp `sort`, phân trang `page`, `limit`).
- `GET /api/products/featured` : Lấy các sản phẩm cá Betta nổi bật trang chủ.
- `GET /api/products/categories` : Lấy danh sách danh mục và số lượng sản phẩm.
- `GET /api/products/:id` : Lấy thông tin chi tiết một sản phẩm theo ID hoặc Slug.
- `POST /api/products` *(Admin)* : Thêm sản phẩm cá mới.
- `PUT /api/products/:id` *(Admin)* : Chỉnh sửa thông tin/giá/tồn kho sản phẩm.
- `DELETE /api/products/:id` *(Admin)* : Xóa sản phẩm.

### 3. Giỏ hàng Server-side (`/api/cart`)
- `GET /api/cart` : Lấy giỏ hàng của tài khoản đang đăng nhập.
- `POST /api/cart` : Thêm sản phẩm vào giỏ hàng (`productId`, `quantity`).
- `PUT /api/cart/:itemId` : Cập nhật số lượng sản phẩm.
- `DELETE /api/cart/:itemId` : Xóa sản phẩm khỏi giỏ.
- `DELETE /api/cart` : Dọn sạch toàn bộ giỏ hàng.

### 4. Đơn hàng & Thanh toán (`/api/orders`)
- `POST /api/orders` : Đặt đơn hàng mới (tự động tính tổng tiền, phí vận chuyển thùng xốp nén oxy, giảm trừ tồn kho và làm sạch giỏ hàng).
- `GET /api/orders` : Lịch sử đơn hàng của người dùng (Admin xem toàn bộ đơn).
- `GET /api/orders/:id` : Chi tiết đơn hàng.
- `PUT /api/orders/:id/status` *(Admin)* : Cập nhật trạng thái đơn hàng (`PENDING`, `CONFIRMED`, `SHIPPING`, `DELIVERED`, `CANCELLED`).

---

## 💎 Các Điểm Nhấn Thiết Kế Frontend
- **Design System cao cấp:** Bảng màu Ocean & Neon Gradient hiện đại, dark mode / light mode toggle mượt mà.
- **Glassmorphism:** Thanh điều hướng sticky mờ sang trọng, bộ lọc sản phẩm linh hoạt.
- **Micro-interactions:** Hiệu ứng hover phóng to ảnh, giỏ hàng badge cập nhật theo thời gian thực (CustomEvent).
- **Hệ thống Toast Notification:** Thông báo trực quan (thêm giỏ hàng, sao chép mã giảm giá, đăng nhập thành công).
- **Mã ưu đãi:** Nhập mã `BETTA10` để được giảm ngay 10% tổng đơn hàng tại trang giỏ hàng.
