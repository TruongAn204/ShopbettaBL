import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Số lượng phải từ 0 trở lên (0 để xóa)' })
  @Type(() => Number)
  quantity: number;
}
