import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @IsNotEmpty({ message: 'Product ID không được để trống' })
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  @Type(() => Number)
  quantity: number;
}
