import { EventRecommendation } from '@joinus/domain';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class EventRecommendationDto implements EventRecommendation {
  @IsUUID('4')
  uuid!: string;

  @IsNumber()
  @Min(0)
  distance!: number;
}
