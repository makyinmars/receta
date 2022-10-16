declare module "types" {
  interface Recipe {
    cook_time_minutes: number;
    country: string;
    description: string;
    id: number;
    instructions: [
      {
        display_text: string;
        position: number;
      }
    ];
    name: string;
    original_video_url: string;
    prep_time_minutes: number;
    tags: [
      {
        name: string;
        display_name: string;
        id: number;
        type: string;
      }
    ];
    thumbnail_url: string;
    topics: [
      {
        name: string;
        slug: string;
      }
    ];
    user_ratings: {
      count_positive: number;
      count_negative: number;
      score: number;
    };
  }
}
