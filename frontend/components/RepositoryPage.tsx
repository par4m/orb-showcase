import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

import 'github-markdown-css/github-markdown-light.css';
import { getUniversityDisplayName } from "@/lib/universities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {Eye, ArrowLeft, Star, GitFork, Download, ExternalLink, Users, Calendar, Code, User } from "lucide-react";
import Link from "next/link";
import { ContributorsScrollArea } from "@/components/ContributorsScrollArea";

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
  readme?: string;
  default_branch?: string;
}

interface Props {
  repo: Repository;
  contributors?: string[];
  readme?: string;
}

interface ReadmeViewerProps {
  source?: string | null;
  repoOwner: string;
  repoName: string;
  branch?: string;
}

function fixImageUrls(markdown: string, repoOwner: string, repoName: string, branch?: string ) {
  const safeBranch = branch || "main";
  // Replace markdown image syntax ![alt](relative.png)
  let result = markdown.replace(/!\[([^\]]*)\]\(((?!https?:\/\/)[^\)]+)\)/g, (match, alt, relPath) => {
    const cleanPath = relPath.replace(/^\.?\//, ""); // remove leading ./ or /
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/${safeBranch}/${cleanPath}`;
    return `![${alt}](${url})`;
  });
  // Replace HTML <img src="relative.png"> (quoted src)
  result = result.replace(/<img([^>]+)src=["'](?!https?:\/\/)([^"'>]+)["']/g, (match, before, relPath) => {
    const cleanPath = relPath.replace(/^\.?\//, ""); // remove leading ./ or /
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/${safeBranch}/${cleanPath}`;
    return `<img${before}src="${url}"`;
  });
  // Replace HTML <img src=relative.png> (unquoted src)
  result = result.replace(/<img([^>]+)src=(?!["'])([^\s>]+)([\s>])/g, (match, before, relPath, after) => {
    // Only rewrite if not an absolute URL
    if (/^(https?:)?\//.test(relPath)) return match;
    const cleanPath = relPath.replace(/^\.?\//, "");
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/${safeBranch}/${cleanPath}`;
    return `<img${before}src="${url}"${after}`;
  });
  // Replace HTML <source srcset="relative.png"> (quoted srcset)
  result = result.replace(/<source([^>]+)srcset=["'](?!https?:\/\/)([^"'>]+)["']/g, (match, before, relPath) => {
    const cleanPath = relPath.replace(/^\.?\//, "");
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/${safeBranch}/${cleanPath}`;
    return `<source${before}srcset="${url}"`;
  });
  // Replace HTML <source srcset=relative.png> (unquoted srcset)
  result = result.replace(/<source([^>]+)srcset=(?!["'])([^\s>]+)([\s>])/g, (match, before, relPath, after) => {
    if (/^(https?:)?\//.test(relPath)) return match;
    const cleanPath = relPath.replace(/^\.?\//, "");
    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/${safeBranch}/${cleanPath}`;
    return `<source${before}srcset="${url}"${after}`;
  });
  // Also fix github.com/blob URLs as before
  result = result.replace(
    /https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^\")\s]+)/g,
    'https://raw.githubusercontent.com/$1/$2/$3/$4'
  );
  return result;
}

function ReadmeViewer({ source, repoOwner, repoName, branch }: ReadmeViewerProps) {
  const [readme, setReadme] = useState<string | null>(source || null);

  useEffect(() => {
    if (!readme && repoOwner && repoName && branch) {
      // Try to fetch README.md from GitHub
      const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/README.md`;
      fetch(url)
        .then(res => res.ok ? res.text() : null)
        .then(text => {
          if (text) setReadme(text);
        });
    }
  }, [readme, repoOwner, repoName, branch]);

  if (!readme) {
    return <div className="markdown-body p-4 text-gray-400">No README found.</div>;
  }

  return (
    <div className="markdown-body p-4">
      <ReactMarkdown
        children={fixImageUrls(readme, repoOwner, repoName, branch)}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      />
    </div>
  );
}

function useOrgInfo(org: string | undefined) {
  const [orgInfo, setOrgInfo] = useState<{ blog?: string; html_url?: string } | null>(null);
  useEffect(() => {
    if (!org) return;
    fetch(`https://api.github.com/orgs/${org}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setOrgInfo({ blog: data.blog, html_url: data.html_url });
      });
  }, [org]);
  return orgInfo;
}

export const RepositoryPage: React.FC<Props> = ({ repo, contributors}) => {
  const branch = repo.default_branch || "main";
  const orgInfo = useOrgInfo(repo.owner);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-10">
        <div className="container max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-sky-800 mb-2">{repo.full_name}</h1>
                <p className="text-lg text-gray-600 mb-4">{repo.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {repo.language && <Badge variant="outline" className="text-sm">{repo.language}</Badge>}
                  {repo.license && <Badge variant="secondary" className="text-sm">{repo.license}</Badge>}
                  {repo.university && <Badge variant="secondary" className="text-sm">{getUniversityDisplayName(repo.university)}</Badge>}
                </div>
              
              </div>
              <Card>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full flex">
                    <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                    <TabsTrigger value="readme" className="flex-1">README</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Development Team:</span>
                        <a href={orgInfo?.html_url} target="_blank" rel="noopener noreferrer" className="text-sky-600">{repo.owner} </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">License:</span>
                        <span className="text-sm">{repo.license || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">External Links:</span>
                        <span className="flex flex-col gap-1">
              
                          {orgInfo?.blog && orgInfo.blog !== "" && (
                            <a href={orgInfo.blog} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">Blog</a>
                          )}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="readme">
                    <div className="max-w-4xl w-full overflow-x-auto">
                      <ReadmeViewer source={repo.readme} repoOwner={repo.owner || ""} repoName={repo.full_name?.split("/").pop() || ""} branch={branch} />
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
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
                  {repo.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Created {repo.created_at.split("T")[0]}</span>
                    </div>
                  )}
                  {repo.language && (
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{repo.language}</span>
                    </div>
                  )}
                  {repo.homepage && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                      <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline"><span className="text-sm">{repo.homepage}</span></a>
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
                  <CardTitle className="text-sky-700">Contributors - {repo.contributors}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContributorsScrollArea contributors={contributors || []} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryPage;