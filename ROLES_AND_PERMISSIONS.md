# 👥 HỆ THỐNG PHÂN QUYỀN & VAI TRÒ (ROLES & PERMISSIONS)
### Dự án: Shop Cá Cảnh Betta Bạc Liêu (Shop-Betta-BL)

---

## 📌 TỔNG QUAN VỀ CÁC VAI TRÒ
Hệ thống hiện tại được thiết kế theo mô hình **RBAC (Role-Based Access Control)** với **3 cấp bậc người dùng**:

| Cấp bậc | Tên vai trò | Mã Role trong DB | Phương thức xác thực | Mô tả |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Khách Vãng Lai** *(Guest)* | `NONE` | Không cần đăng nhập | Người xem web tự do, duyệt sản phẩm và mua hàng nhanh. |
| **2** | **Khách Hàng Thành Viên** *(Customer)* | `CUSTOMER` | Bearer JWT Token | Người dùng đã đăng ký tài khoản, có lịch sử mua hàng. |
| **3** | **Quản Trị Viên / Chủ Trại** *(Admin)* | `ADMIN` | Bearer JWT Token + `@Roles(Role.ADMIN)` | Toàn quyền quản trị sản phẩm, duyệt đơn và quản lý kho cá. |

---

## 📋 CHI TIẾT CHỨC NĂNG CỦA TỪNG VAI TRÒ

### 🟢 1. VAI TRÒ: KHÁCH VÃNG LAI (GUEST - CHƯA ĐĂNG NHẬP)
Dành cho người mới truy cập website, có thể trải nghiệm đầy đủ các tính năng mua sắm:

* **Xem & Khám phá:**
  - Xem trang chủ (`index.html`): Banner cá nổi bật, đợt flash sale countdown, các dòng cá hot.
  - Xem danh mục các dòng cá: Betta Halfmoon, Plakat (PK), Crowntail, Betta Alien, thức ăn, hồ kính phụ kiện.
  - Xem danh sách sản phẩm và bộ lọc (`products.html`):
    - Lọc theo dòng cá / danh mục.
    - Lọc theo khoảng giá tiền (Từ ... Đến ... VNĐ).
    - Sắp xếp theo: Mới nhất, Giá tăng dần, Giá giảm dần, Đánh giá cao nhất.
  - Xem trang chi tiết cá (`product-detail.html`):
    - Xem thư viện hình ảnh thực tế (đổi thumbnail, zoom ảnh).
    - Xem thông số cá: Độ tuổi (3.5 - 4.5 tháng), size cá (Size M), giới tính (Cá Đực / Cá Mái), form vây.
    - Xem chính sách vận chuyển đóng thùng xốp nén oxy và bảo hành cá sống khỏe 100%.
* **Giỏ hàng & Mua hàng:**
  - Thêm cá vào giỏ hàng (`cart.html`), lưu trữ cục bộ qua `LocalStorage`.
  - Tăng / giảm số lượng, xóa từng món hoặc xóa sạch giỏ hàng.
  - Nhập mã giảm giá khuyến mãi (ví dụ mã `BETTA10` giảm 10% tổng hóa đơn).
  - Đặt hàng nhanh (`checkout.html`): Điền thông tin người nhận, số điện thoại, địa chỉ nhận cá và chọn hình thức thanh toán (COD, Chuyển khoản, MoMo).
* **Tiện ích hệ thống:**
  - Chuyển đổi giao diện Sáng / Tối (Light Mode / Dark Mode).
  - Đăng ký tài khoản mới hoặc Đăng nhập.

---

### 🔵 2. VAI TRÒ: KHÁCH HÀNG THÀNH VIÊN (CUSTOMER)
Dành cho khách hàng đã có tài khoản trên hệ thống, được tích hợp thêm các tiện ích cá nhân hóa:

* **Toàn bộ quyền của Khách Vãng Lai.**
* **Đồng bộ & Cá nhân hóa tài khoản:**
  - Đăng nhập bảo mật qua JWT Token (`POST /api/auth/login`).
  - Tự động điền sẵn Họ tên, SĐT, Email và Địa chỉ giao hàng khi vào trang thanh toán.
  - Xem và chỉnh sửa thông tin cá nhân: Họ tên, số điện thoại, địa chỉ (`GET /api/users/me`, `PUT /api/users/me`).
* **Quản lý Giỏ hàng Server-side:**
  - Tự động lưu giỏ hàng lên Database server (`/api/cart`), giúp đăng nhập ở máy tính hay điện thoại khác vẫn giữ nguyên giỏ hàng.
* **Lịch sử đơn hàng:**
  - Xem danh sách các đơn hàng cá cảnh mình đã từng đặt (`GET /api/orders`).
  - Theo dõi mã vận đơn, chi tiết số lượng cá, tổng tiền và trạng thái giao nhận (`PENDING`, `CONFIRMED`, `SHIPPING`, `DELIVERED`).
* **Bảo mật:**
  - Đăng xuất an toàn (thu hồi phiên làm việc trên trình duyệt).

---

### 🔴 3. VAI TRÒ: QUẢN TRỊ VIÊN / CHỦ SHOP (ADMIN)
Quyền lực cao nhất, quản lý toàn bộ hoạt động kinh doanh của Shop Betta BL:

* **Toàn bộ quyền của Khách Hàng Thành Viên.**
* **Quản trị Sản phẩm & Kho cá (`/api/products` - Yêu cầu `@Roles(Role.ADMIN)`):**
  - **Thêm cá mới (`POST /api/products`):** Đặt tên cá, tạo slug tự động, chọn danh mục, đặt giá bán, giá khuyến mãi, số lượng tồn kho trong trại, upload link ảnh, đánh dấu cá Hot / Featured.
  - **Sửa sản phẩm (`PUT /api/products/:id`):** Thay đổi giá tiền, cập nhật tình trạng hết hàng / còn hàng, bổ sung hình ảnh, đổi thông tin mô tả cá.
  - **Xóa sản phẩm (`DELETE /api/products/:id`):** Gỡ cá đã bán hết hoặc không kinh doanh khỏi danh sách.
* **Quản trị Đơn hàng toàn hệ thống (`/api/orders` - Yêu cầu `@Roles(Role.ADMIN)`):**
  - Xem danh sách **toàn bộ đơn hàng** của tất cả khách hàng trên toàn quốc.
  - Xem chi tiết thông tin khách: Tên, SĐT gọi xác nhận, địa chỉ giao cá, ghi chú đóng thùng xốp.
  - **Cập nhật trạng thái đơn hàng (`PUT /api/orders/:id/status`):**
    - `PENDING`: Đơn mới chờ nhân viên gọi điện chốt đơn.
    - `CONFIRMED`: Đã gọi xác nhận, đang bắt cá vào bọc nén oxy.
    - `SHIPPING`: Đã giao cho đơn vị vận chuyển / nhà xe.
    - `DELIVERED`: Khách đã nhận cá sống khỏe thành công.
    - `CANCELLED`: Khách hủy đơn.
  - **Cập nhật trạng thái thanh toán:**
    - `UNPAID`: Chưa nhận được tiền (đang chờ COD hoặc khách chưa chuyển khoản).
    - `PAID`: Đã nhận tiền thành công (qua chuyển khoản ngân hàng hoặc shipper đã thu tiền COD).
* **Quản lý Cơ sở dữ liệu cấp cao (pgAdmin 4):**
  - Truy cập `http://localhost:5050` để xem trực tiếp các bảng `users`, `products`, `orders`, `categories`, thực hiện sao lưu (backup) hoặc khôi phục dữ liệu.

---

## 🔒 BẢNG MA TRẬN PHÂN QUYỀN API (API PERMISSION MATRIX)

| API Endpoint | Phương thức | Mô tả chức năng | Khách (Guest) | Khách Hàng (Customer) | Quản Trị Viên (Admin) |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `/api/auth/register` | `POST` | Đăng ký tài khoản | ✅ | ✅ | ✅ |
| `/api/auth/login` | `POST` | Đăng nhập lấy JWT Token | ✅ | ✅ | ✅ |
| `/api/auth/profile` | `GET` | Lấy profile token hiện tại | ❌ | ✅ | ✅ |
| `/api/users/me` | `GET`, `PUT` | Xem / Sửa hồ sơ cá nhân | ❌ | ✅ | ✅ |
| `/api/products` | `GET` | Lấy danh sách cá, lọc, sắp xếp | ✅ | ✅ | ✅ |
| `/api/products/featured`| `GET` | Xem cá bán chạy / nổi bật | ✅ | ✅ | ✅ |
| `/api/products/categories`| `GET`| Lấy danh mục dòng cá | ✅ | ✅ | ✅ |
| `/api/products/:id` | `GET` | Xem chi tiết 1 chú cá | ✅ | ✅ | ✅ |
| `/api/products` | `POST` | Thêm cá mới vào hệ thống | ❌ | ❌ | **✅ (Admin Only)** |
| `/api/products/:id` | `PUT` | Sửa thông tin / giá cá | ❌ | ❌ | **✅ (Admin Only)** |
| `/api/products/:id` | `DELETE` | Xóa cá khỏi hệ thống | ❌ | ❌ | **✅ (Admin Only)** |
| `/api/cart` | `GET`, `POST` | Quản lý giỏ hàng trên máy chủ | ❌ | ✅ | ✅ |
| `/api/cart/:itemId` | `PUT`, `DELETE`| Sửa số lượng / xóa món giỏ hàng| ❌ | ✅ | ✅ |
| `/api/orders` | `POST` | Tạo đơn hàng mới | ✅ (Đặt nhanh) | ✅ (Tự điền) | ✅ |
| `/api/orders` | `GET` | Xem danh sách đơn hàng | ❌ | ✅ *(Chỉ đơn của mình)*| **✅ (Xem tất cả đơn)** |
| `/api/orders/:id` | `GET` | Xem chi tiết đơn hàng | ❌ | ✅ *(Chỉ đơn của mình)*| **✅ (Xem tất cả đơn)** |
| `/api/orders/:id/status`| `PUT` | Đổi trạng thái đơn & thanh toán | ❌ | ❌ | **✅ (Admin Only)** |

---

## 🔑 TÀI KHOẢN MẪU ĐỂ TEST HỆ THỐNG (DEMO ACCOUNTS)

| Vai trò | Email đăng nhập | Mật khẩu mặc định | Ghi chú quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@betta.vn` | `Admin@123456` | Toàn quyền kiểm soát sản phẩm và duyệt đơn hàng |
| **Khách hàng (Customer)** | `khachhang@gmail.com` | `Customer@123456` | Tài khoản khách hàng thông thường |
