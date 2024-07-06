import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt } from 'class-validator';
import { z } from "zod";

export class CreateTransactionDto implements CreateTransactionDtoSchema{
  @ApiProperty()
  @IsUUID()
  account_id: string;

  @ApiProperty()
  @IsInt()
  amount: number;
}


export const createTransactionDtoSchema = z.object({
  account_id: z.string().uuid(),
  amount: z.number().int(),
});

type CreateTransactionDtoSchema = z.infer<typeof createTransactionDtoSchema>;