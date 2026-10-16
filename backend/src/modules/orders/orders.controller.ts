import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role, OrderStatus, PaymentStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    // Optional JWT extraction if present
    const authHeader = req.headers['authorization'];
    let userId: string | undefined = undefined;

    if (req.user?.id) {
      userId = req.user.id;
    }

    return this.ordersService.create(createOrderDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user?.id, user?.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user?.id, user?.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus },
  ) {
    return this.ordersService.updateStatus(
      id,
      body.orderStatus,
      body.paymentStatus,
    );
  }
}
