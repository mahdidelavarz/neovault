import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/http";
import { CreateFeedbackDto, Feedback } from "@/features/feedback/types/feedback";

// Submit feedback (any authenticated user)
export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: async (payload: CreateFeedbackDto) => {
      const { data } = await api.post("/feedback", payload);
      return (data as { feedback: Feedback }).feedback;
    },
  });
};

// List all feedback (admin-only — backend returns 403 otherwise)
export const useAdminFeedback = () => {
  return useQuery({
    queryKey: ["feedback", "admin"],
    queryFn: async () => {
      const { data } = await api.get("/feedback/admin");
      return (data as { feedback: Feedback[] }).feedback;
    },
  });
};
