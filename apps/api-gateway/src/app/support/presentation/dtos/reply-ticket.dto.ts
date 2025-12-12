import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReplyTicketDto {
  @ApiProperty({
    description: "Content of the reply message for the ticket",
    example:
      "Thank you for your response. I have attached screenshots of the error.",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
