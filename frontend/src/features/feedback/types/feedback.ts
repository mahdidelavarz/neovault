export type FeedbackType = "bug" | "feature" | "comment";

export interface CreateFeedbackDto {
  type: FeedbackType;
  message: string;
}

export interface FeedbackUser {
  id: number;
  username: string;
  email?: string;
}

export interface Feedback {
  id: number;
  type: FeedbackType;
  message: string;
  user?: FeedbackUser;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
