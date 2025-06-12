import { RepositoryCard } from "@/components/RepositoryCard";
import React from "react";

interface RepositoryGridProps {
  repositories: any[];
}

export const RepositoryGrid: React.FC<RepositoryGridProps> = ({ repositories }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {repositories.map((repo) => (
      <RepositoryCard key={repo.id} repo={repo} />
    ))}
  </div>
);
