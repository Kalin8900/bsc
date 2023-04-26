export interface SimilarEvent {
  uuid: string;
  catSimilarity: number;
  tagsSimilarity: number;
  distancePoints: number;
  totalSimilarity: number;
  distance: number;
}

export interface EventRecommendation {
  uuid: string;
  distance: number;
}
