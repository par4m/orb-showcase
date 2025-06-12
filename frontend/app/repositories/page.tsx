"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RepositoryFilters } from "@/components/RepositoryFilters/RepositoryFilters";
import { RepositoryGrid } from "@/components/RepositoryGrid/RepositoryGrid";
import { RepositoryPagination } from "@/components/RepositoryPagination/RepositoryPagination";
import { RepositoryEmptyState } from "@/components/RepositoryEmptyState/RepositoryEmptyState";
import { RepositoryErrorState } from "@/components/RepositoryErrorState/RepositoryErrorState";
import { RepositoryLoadingGrid } from "@/components/RepositoryLoadingGrid/RepositoryLoadingGrid";
import { Select as PageSizeSelect, SelectTrigger as PageSizeSelectTrigger, SelectContent as PageSizeSelectContent, SelectItem as PageSizeSelectItem, SelectValue as PageSizeSelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"
import { RepositoryCardSkeleton } from "@/components/RepositoryCardSkeleton"
import { useState, useEffect, useMemo } from "react"
import fuzzysort from "fuzzysort"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const API_URL = process.env.NEXT_PUBLIC_API_URL


export default function RepositoriesPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [university, setUniversity] = useState("__all__")
  const [language, setLanguage] = useState("__all__")
  const [license, setLicense] = useState("__all__")
  const [owner, setOwner] = useState("__all__")

  // Fetch filter options
  const { data: universities } = useQuery({
    queryKey: ["universities"],
    queryFn: () => fetch(`${API_URL}/universities`).then(res => res.json()),
  })
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => fetch(`${API_URL}/languages`).then(res => res.json()),   
  })
  const { data: licenses } = useQuery({
    queryKey: ["licenses"],
    queryFn: () => fetch(`${API_URL}/licenses`).then(res => res.json()),
  })
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => fetch(`${API_URL}/organizations`).then(res => res.json()),
  })

  // Fetch repositories
  const { data: repositories, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["repositories", university, language, license, owner],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (university && university !== "__all__") params.append("university", university)
      if (language && language !== "__all__") params.append("language", language)
      if (license && license !== "__all__") params.append("license", license)
      if (owner && owner !== "__all__") params.append("owner", owner)
      const res = await fetch(`${API_URL}/repositories?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch repositories")
      return res.json()
    },
  })

  useEffect(() => {
    const urlSearch = searchParams.get("search")
    if (urlSearch) setSearchTerm(urlSearch)
  }, [searchParams])

  const handleApplyFilters = () => {
    refetch()
  }

  // Client-side search filter
  const filteredRepositories = useMemo(() => {
    if (!repositories) return [];
    if (!searchTerm.trim()) return repositories;
    // Fuzzy search across full_name and description
    const results = fuzzysort.go(
      searchTerm,
      repositories,
      {
        keys: ["full_name", "description"],
        threshold: -10000, // show all matches, even weak
        limit: 50,
      }
    );
    return results.map((r: any) => r.obj);
  }, [repositories, searchTerm]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Default 20 per page

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1); }, [searchTerm, university, language, license, owner, repositories]);

  // Calculate pagination
  const totalItems = filteredRepositories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedRepos = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRepositories.slice(start, start + pageSize);
  }, [filteredRepositories, page, pageSize]);

  // Pagination controls logic (show ellipsis, etc)
  function getPageNumbers(current: number, total: number) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const arr = [];
    // Always show first page
    arr.push(1);
    // Show 2 and 3 if on the first 3 pages
    if (current <= 3) {
      arr.push(2, 3);
      if (current < 3) arr.push('ellipsis-next');
    } else if (current >= total - 2) {
      // Near the end: show ellipsis before last 3 pages
      arr.push('ellipsis-prev');
      for (let i = total - 4; i <= total - 1; i++) arr.push(i);
    } else {
      // Middle: show ellipsis, current-1, current, current+1, ellipsis
      arr.push('ellipsis-prev');
      arr.push(current - 1, current, current + 1);
      arr.push('ellipsis-next');
    }
    // Always show last page
    arr.push(total);
    // Remove duplicates and keep order
    return arr.filter((v, i, a) => a.indexOf(v) === i);
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold text-sky-800">Browse Repositories</h1>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-gray-600 text-sm">Show</span>
              <PageSizeSelect value={String(pageSize)} onValueChange={v => setPageSize(Number(v))}>
                <PageSizeSelectTrigger className="w-[70px] h-8 text-sm border-gray-300">
                  <PageSizeSelectValue />
                </PageSizeSelectTrigger>
                <PageSizeSelectContent>
                  {[10, 20, 30, 40].map(n => (
                    <PageSizeSelectItem key={n} value={String(n)}>{n}</PageSizeSelectItem>
                  ))}
                </PageSizeSelectContent>
              </PageSizeSelect>
              <span className="text-gray-600 text-sm">per page</span>
              <span className="ml-4 text-gray-500 text-xs">{totalItems} repositories</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
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
            <div className="space-y-6">
              {isLoading ? (
                <RepositoryLoadingGrid />
              ) : error ? (
                <RepositoryErrorState error={error} />
              ) : filteredRepositories.length > 0 ? (
                <>
                  {isFetching && !isLoading && (
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="animate-spin h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span className="text-xs text-sky-600">Refreshing…</span>
                    </div>
                  )}
                  <RepositoryGrid repositories={paginatedRepos} />
                  <RepositoryPagination
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                  />
                </>
              ) : (
                <RepositoryEmptyState />
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

