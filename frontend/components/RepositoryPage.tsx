import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {Eye, ArrowLeft, Star, GitFork, Download, ExternalLink, Users, Calendar, Code } from "lucide-react";
import Link from "next/link";

export interface Repository {
  id: number;
  full_name: string;
  description?: string;
  university?: string;
  license?: string;
  owner?: string;
  organization?: number;
  language?: string;
  stargazers_count?: number;
  html_url?: string;
  forks_count?: number;
  subscribers_count?: number;
  created_at?: string;
  contributors?: number;
  homepage?: string;
}

interface Props {
  repo: Repository;
}

export const RepositoryPage: React.FC<Props> = ({ repo }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/images/uc-ospo-logo.svg" alt="UC OSPO Network" className="h-8 w-auto" />
            <span className="text-xl font-bold text-sky-700">UC ORB</span>
          </a>
          <nav className="flex gap-6">
            <a href="/" className="font-medium">Home</a>
            <a href="/repositories" className="font-medium">Repositories</a>
            <a href="/about" className="font-medium">About</a>
            <a href="/connect" className="font-medium">Connect</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-10">
        <div className="container max-w-6xl">
          <div className="mb-6">
            <Link href="/repositories" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Repositories
            </Link>
          </div>
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-sky-800 mb-2">{repo.full_name}</h1>
                <p className="text-lg text-gray-600 mb-4">{repo.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {repo.language && <Badge variant="outline" className="text-sm">{repo.language}</Badge>}
                  {repo.license && <Badge variant="secondary" className="text-sm">{repo.license}</Badge>}
                  {repo.university && <Badge variant="secondary" className="text-sm">{repo.university}</Badge>}
                </div>
                <div className="flex gap-4 mb-8">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>{repo.stargazers_count} stars</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forks_count} forks</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{repo.subscribers_count} views</span>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sky-700">Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{repo.description}</p>
                </CardContent>
              </Card>
              {repo.homepage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sky-700">Homepage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                      {repo.homepage}
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sky-700">Repository Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repo.owner && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{repo.owner}</span>
                    </div>
                  )}
                  {repo.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Created {repo.created_at.split("T")[0]}</span>
                    </div>
                  )}
                  {repo.license && (
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{repo.license}</span>
                    </div>
                  )}
                  {repo.html_url && (
                    <div className="pt-4">
                      <Link href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-sky-600 hover:bg-sky-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span className="text-white">View on GitHub</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sky-700">Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500 pt-2">{repo.contributors} contributors</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-sky-800 text-white py-8">
        <div className="container flex justify-center items-center gap-4">
          <p>© {new Date().getFullYear()} UC OSPO Network. All rights reserved.</p>
          <a
            href="https://github.com/UC-OSPO-Network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-sky-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default RepositoryPage;

