import { Suspense } from "react";
import { RepositoriesPageClient } from "./RepositoriesPageClient";
import { RepositoriesProvider } from "@/context/RepositoriesContext";

export default function RepositoriesPage() {
  return (
    <RepositoriesProvider>
      <Suspense fallback={null}>
        <RepositoriesPageClient />
      </Suspense>
    </RepositoriesProvider>
  );
}

