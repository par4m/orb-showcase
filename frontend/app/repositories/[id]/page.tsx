"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RepositoryPage } from "../../../components/RepositoryPage";
import { RepositoryPageSkeleton } from "../../../components/RepositoryPageSkeleton";
import { RepositoryErrorState } from "@/components/RepositoryErrorState/RepositoryErrorState";
import Link from "next/link";
import Head from "next/head";
import React, { Suspense } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Repository = {
  id: number;
  full_name: string;
  description: string;
  language: string;
  license: string;
  owner: string;
  contributors?: number;
  created_at?: string;
  updated_at?: string;
  pushed_at?: string;
  // add other fields as needed
};

export default function RepositoryDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: repo,
    isLoading,
    error,
    isFetched,
    isError
  } = useQuery<Repository>({
    queryKey: ["repository", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/repositories/${id}`);
      if (res.status === 404) {
        // Parse the error body for detail if present
        let message = "Repository not found";
        try {
          const data = await res.json();
          if (data && typeof data.detail === "string") message = data.detail;
        } catch {}
        const err = new Error(message);
        (err as any).code = 404;
        throw err;
      }
      if (!res.ok) throw new Error("Failed to fetch repository");
      return res.json();
    },
    enabled: !!id,
    retry: false,
  });

  const is404 = isError && error && (
    (typeof error === "object" && error !== null && "code" in error && (error as any).code === 404) ||
    error.message === "Repository not found"
  );

  // Show not found UI immediately after fetch if 404
  if (is404 && isFetched) {
    return (
      <>
        <Head>
          <title>Repository Not Found | ORB Showcase</title>
        </Head>
        <RepositoryErrorState error={"Repository not found"}>
          <div className="flex flex-col items-center gap-2 mt-4">
            <Link href="/repositories" className="text-sky-700 underline">Back to Repositories</Link>
          </div>
        </RepositoryErrorState>
      </>
    );
  }

  // Only show skeleton during the initial fetch, not after a 404
  if (isLoading && !isFetched) return <RepositoryPageSkeleton />;
  if (isError || !repo) return (
    <>
      <Head>
        <title>Error | ORB Showcase</title>
      </Head>
      <RepositoryErrorState error={error || "Not found"}>
        <div className="flex flex-col items-center gap-2 mt-4">
          <Link href="/repositories" className="text-sky-700 underline">Back to Repositories</Link>
        </div>
      </RepositoryErrorState>
    </>
  );

  return (
    <>
      <Head>
        <title>{repo.full_name} | ORB Showcase</title>
        <meta name="description" content={repo.description || "Repository details"} />
      </Head>
      <RepositoryPage repo={repo} />
    </>
  );
}

