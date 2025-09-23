// hooks/useAllFaq.ts
import { useQuery} from "@tanstack/react-query";
import { getAllFaq} from "@/lib/api";

// get all faq
export function useAllFaq() {
  return useQuery({
    queryKey: ["faq"],
    queryFn: () => getAllFaq(),
  });
}
