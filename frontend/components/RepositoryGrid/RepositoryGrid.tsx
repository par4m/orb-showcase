import { RepositoryCard } from "@/components/RepositoryCard";
import React from "react";

interface RepositoryGridProps {
  repositories: any[];
}

export const RepositoryGrid: React.FC<RepositoryGridProps> = ({ repositories }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-4 xl:px-8">
    {repositories.map((repo) => (
      <RepositoryCard key={repo.id} repo={repo} />
    ))}
  </div>
);
