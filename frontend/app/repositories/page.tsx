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
  const { data: repositories, isLoading, error, refetch } = useQuery({
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

  const [statusFilter, setStatusFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [topicFilter, setTopicFilter] = useState("all")



  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/uc-ospo-logo.svg" alt="UC OSPO Network" className="h-8 w-auto" />
            <span className="text-xl font-bold text-sky-700">UC ORB</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="font-medium">
              Home
            </Link>
            <Link href="/repositories" className="font-medium font-bold text-sky-700">
              Repositories
            </Link>
            <Link href="/about" className="font-medium">
              About
            </Link>
            <Link href="/connect" className="font-medium">
              Connect
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8 text-sky-800">Browse Repositories</h1>

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
                <div className="text-center py-12">
                  <p>Loading repositories...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-red-800">{typeof error === "string" ? error : error?.message ?? String(error)}</p>
                </div>
              ) : filteredRepositories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRepositories.map((repo: any) => (
                    <RepositoryCard key={repo.id} repo={repo} />
                  ))}
                </div>
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

