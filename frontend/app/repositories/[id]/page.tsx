"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RepositoryPage } from "../../../components/RepositoryPage";
import { RepositoryPageSkeleton } from "../../../components/RepositoryPageSkeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RepositoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: repo, isLoading, error } = useQuery({
    queryKey: ["repository", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/repositories/${id}`);
      if (!res.ok) throw new Error("Failed to fetch repository");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) return <RepositoryPageSkeleton />;
  if (error || !repo) return <div>Not found</div>;

  return <RepositoryPage repo={repo} />;
}

