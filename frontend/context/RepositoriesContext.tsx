"use client";
import React, { createContext, useContext, useState } from "react";

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

type RepositoriesContextType = {
  repositories: Repository[];
  setRepositories: React.Dispatch<React.SetStateAction<Repository[]>>;
};

const RepositoriesContext = createContext<RepositoriesContextType | undefined>(undefined);

export const useRepositories = () => {
  const ctx = useContext(RepositoriesContext);
  if (!ctx) throw new Error("useRepositories must be used within RepositoriesProvider");
  return ctx;
};

export const RepositoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  return (
    <RepositoriesContext.Provider value={{ repositories, setRepositories }}>
      {children}
    </RepositoriesContext.Provider>
  );
};
