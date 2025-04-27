import { IsNumber } from "class-validator";

export class CreateTaskDto {
    @IsNumber()
    difficulty_level: number
    @IsNumber()
    time_to_do: number
}
