"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useMemo } from "react"
import fuzzysort from "fuzzysort"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { RepositoryCard } from "@/components/RepositoryCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Select as PageSizeSelect, SelectTrigger as PageSizeSelectTrigger, SelectContent as PageSizeSelectContent, SelectItem as PageSizeSelectItem, SelectValue as PageSizeSelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"
import { RepositoryCardSkeleton } from "@/components/RepositoryCardSkeleton"


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
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Search</h3>
                <Input
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">University</h3>
                <Select value={university} onValueChange={setUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Universities</SelectItem>
                    {universities && universities.map((uni: string) => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Languages</SelectItem>
                    {languages && languages.map((lang: string) => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">License</h3>
                <Select value={license} onValueChange={setLicense}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select license" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Licenses</SelectItem>
                    {licenses && licenses.map((lic: string) => (
                      <SelectItem key={lic} value={lic}>{lic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-medium mb-2">Development Team</h3>
                <Select value={owner} onValueChange={setOwner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Development Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Development Teams</SelectItem>
                    {organizations && organizations.map((org: string) => (
                      <SelectItem key={org} value={org}>{org}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <RepositoryCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-800">{typeof error === "string" ? error : error?.message ?? String(error)}</p>
                </div>
              ) : filteredRepositories.length > 0 ? (
                <>
                  {/* Show a subtle spinner overlay when isFetching but not isLoading */}
                  {isFetching && !isLoading && (
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="animate-spin h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span className="text-xs text-sky-600">Refreshing…</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedRepos.map((repo: any) => (
                      <RepositoryCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                  {/* Pagination controls */}
                  <div className="flex flex-col items-center gap-2 mt-8">
                    <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            aria-disabled={page === 1}
                            tabIndex={page === 1 ? -1 : 0}
                            onClick={e => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                          />
                        </PaginationItem>
                        {getPageNumbers(page, totalPages).map((p, idx) =>
                          p === 'ellipsis-prev' || p === 'ellipsis-next' ? (
                            <PaginationItem key={p + idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={p}>
                              <PaginationLink
                                href="#"
                                isActive={p === page}
                                aria-current={p === page ? 'page' : undefined}
                                onClick={e => { e.preventDefault(); setPage(Number(p)); }}
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        )}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            aria-disabled={page === totalPages}
                            tabIndex={page === totalPages ? -1 : 0}
                            onClick={e => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No repositories found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}

