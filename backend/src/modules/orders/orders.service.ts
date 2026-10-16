import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role, OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto, userId?: string) {
    let subtotal = 0;
    const itemsData = data.items.map((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      return {
        productId: item.productId,
        productName: item.productName,
        productPrice: item.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

    const shippingFee = subtotal >= 500000 ? 0 : 35000;
    const totalAmount = subtotal + shippingFee;

    const orderNumber = `BL-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod,
          notes: data.notes,
          totalAmount,
          items: {
            create: itemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Clear user cart if authenticated
      if (userId) {
        await tx.cartItem.deleteMany({ where: { userId } });
      }

      // Decrement stock
      for (const it of data.items) {
        try {
          await tx.product.update({
            where: { id: it.productId },
            data: { stock: { decrement: it.quantity } },
          });
        } catch {
          // If productId is mock or not in DB, ignore
        }
      }

      return createdOrder;
    });

    return order;
  }

  async findAll(userId?: string, userRole?: Role) {
    if (userRole === Role.ADMIN) {
      return this.prisma.order.findMany({
        include: { items: true, user: { select: { fullName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!userId) return [];

    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string, userRole?: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng: ${id}`);
    }

    if (userRole !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  }

  async updateStatus(
    id: string,
    orderStatus?: OrderStatus,
    paymentStatus?: PaymentStatus,
  ) {
    return this.prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      },
    });
  }
}
