// hooks/useAllFaq.ts
import { useQuery} from "@tanstack/react-query";
import { getAllFaq, getAllFaqHome} from "@/lib/api";

// get all faq Home
export function useAllFaqHome() {
  return useQuery({
    queryKey: ["faq"],
    queryFn: () => getAllFaqHome(),
  });
}

// get all faq
export function useAllFaq() {
  return useQuery({
    queryKey: ["faq"],
    queryFn: () => getAllFaq(),
  });
}
