"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RepositoryFilters } from "@/components/RepositoryFilters/RepositoryFilters";
import { RepositoryGrid } from "@/components/RepositoryGrid/RepositoryGrid";
import { RepositoryPagination } from "@/components/RepositoryPagination/RepositoryPagination";
import { RepositoryEmptyState } from "@/components/RepositoryEmptyState/RepositoryEmptyState";
import { RepositoryErrorState } from "@/components/RepositoryErrorState/RepositoryErrorState";
import { RepositoryLoadingGrid } from "@/components/RepositoryLoadingGrid/RepositoryLoadingGrid";
import fuzzysort from "fuzzysort";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function RepositoriesPageClient() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [university, setUniversity] = useState("__all__");
  const [language, setLanguage] = useState("__all__");
  const [license, setLicense] = useState("__all__");
  const [owner, setOwner] = useState("__all__");

  // Fetch filter options
  const { data: universities } = useQuery({
    queryKey: ["universities"],
    queryFn: () => fetch(`${API_URL}/universities`).then(res => res.json()),
  });
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => fetch(`${API_URL}/languages`).then(res => res.json()),
  });
  const { data: licenses } = useQuery({
    queryKey: ["licenses"],
    queryFn: () => fetch(`${API_URL}/licenses`).then(res => res.json()),
  });
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => fetch(`${API_URL}/organizations`).then(res => res.json()),
  });

    // Fetch repositories (example, adapt as needed)
  const { data: repositories, isLoading, isError, refetch } = useQuery({
    queryKey: ["repositories", { searchTerm, university, language, license, owner }],
    queryFn: () => fetch(`${API_URL}/repositories?...`).then(res => res.json()),
  });

  // Sync search param to state
  React.useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) setSearchTerm(urlSearch);
  }, [searchParams]);

  // Client-side search filter
  const filteredRepositories = React.useMemo(() => {
    if (!repositories) return [];
    if (!searchTerm.trim()) return repositories;
    const results = fuzzysort.go(
      searchTerm,
      repositories,
      { keys: ["full_name", "description"], threshold: -10000, limit: 50 }
    );
    return results.map((r: any) => r.obj);
  }, [repositories, searchTerm]);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  React.useEffect(() => { setPage(1); }, [searchTerm, university, language, license, owner, repositories]);
  const totalItems = filteredRepositories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedRepositories = React.useMemo(() =>
    filteredRepositories.slice((page - 1) * pageSize, page * pageSize),
    [filteredRepositories, page, pageSize]
  );

  const handleApplyFilters = () => { refetch(); };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-sky-800">Browse Repositories</h1>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-600 text-sm">Show</span>
              <select
                className="w-[70px] h-8 text-sm border-gray-300 rounded-md border focus:outline-none focus:ring-amber-400a text-center"
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
              >
                {[10, 20, 30, 40].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="text-gray-600 text-sm">per page</span>
              <span className="ml-4 text-gray-500 text-xs">{totalItems} repositories</span>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            <div>
              <RepositoryFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                university={university}
                setUniversity={setUniversity}
                language={language}
                setLanguage={setLanguage}
                license={license}
                setLicense={setLicense}
                owner={owner}
                setOwner={setOwner}
                universities={universities || []}
                languages={languages || []}
                licenses={licenses || []}
                organizations={organizations || []}
                onApplyFilters={handleApplyFilters}
              />
            </div>
            <div className="space-y-6">
              {isLoading ? (
                <RepositoryLoadingGrid />
              ) : isError ? (
                <RepositoryErrorState error={null} />
              ) : pagedRepositories.length === 0 ? (
                <RepositoryEmptyState />
              ) : (
                <RepositoryGrid repositories={pagedRepositories} />
              )}
              <RepositoryPagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
