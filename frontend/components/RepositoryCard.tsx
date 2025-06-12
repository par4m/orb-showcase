import Link from "next/link";
import { getUniversityDisplayName } from "@/lib/universities";
import { Star, Eye, GitFork } from "lucide-react";

export function RepositoryCard({ repo }: { repo: any }) {
  const colors: {[key: string]: string} = {
    'Python': 'bg-blue-100 text-blue-800',
    'JavaScript': 'bg-yellow-100 text-yellow-800',
    'TypeScript': 'bg-blue-100 text-blue-800',
    'R': 'bg-green-100 text-green-800',
    'C++': 'bg-purple-100 text-purple-800',
    'Julia': 'bg-pink-100 text-pink-800',
  };
  return (
    <Link href={`/repositories/${repo.id}`} className="group">
      <div className="border border-gray-200 rounded-lg transition-shadow hover:shadow-sm h-full p-6 flex flex-col">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-ucblue mb-2 group-hover:underline">{repo.full_name}</h3>

          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{repo.description}</p>
        </div>
        <div className="mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded ${colors[repo.language] || 'bg-gray-100 text-gray-800'}`}>{repo.language}</span>
            {repo.university && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded ml-2">{getUniversityDisplayName(repo.university)}</span>
            )}
            {repo.license && (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 border border-gray-200 ml-2">
                {repo.license}
              </span>
            )}
            <div className="flex items-center space-x-3 text-gray-600 text-sm">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {repo.subscribers_count}
              </span>
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center">
                <GitFork className="h-4 w-4 mr-1" />
                {repo.forks_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
