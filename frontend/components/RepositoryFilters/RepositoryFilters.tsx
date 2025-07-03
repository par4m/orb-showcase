import { Input } from "@/components/ui/input";
import { getUniversityDisplayName } from "@/lib/universities";
import { Button } from "@/components/ui/button";
import React from "react";
import { MultiSelectCombobox } from "@/components/ui/MultiSelectCombobox";

interface RepositoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  universitiesSelected: string[];
  setUniversitiesSelected: (v: string[]) => void;
  languagesSelected: string[];
  setLanguagesSelected: (v: string[]) => void;
  licensesSelected: string[];
  setLicensesSelected: (v: string[]) => void;
  ownersSelected: string[];
  setOwnersSelected: (v: string[]) => void;
  universities: string[];
  languages: string[];
  licenses: string[];
  organizations: string[];
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const RepositoryFilters: React.FC<RepositoryFiltersProps> = ({
  searchTerm, setSearchTerm,
  universitiesSelected, setUniversitiesSelected,
  languagesSelected, setLanguagesSelected,
  licensesSelected, setLicensesSelected,
  ownersSelected, setOwnersSelected,
  universities = [],
  languages = [],
  licenses = [],
  organizations = [],
  onApplyFilters,
  onResetFilters,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-medium mb-2">Search</h3>
      <Input
        placeholder="Search repositories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <MultiSelectCombobox
      options={universities}
      selected={universitiesSelected}
      setSelected={setUniversitiesSelected}
      placeholder="All Universities"
      label="Universities"
      getLabel={getUniversityDisplayName}
      allLabel="All Universities"
    />
    <MultiSelectCombobox
      options={languages}
      selected={languagesSelected}
      setSelected={setLanguagesSelected}
      placeholder="All Languages"
      label="Languages"
      allLabel="All Languages"
    />
    <MultiSelectCombobox
      options={licenses}
      selected={licensesSelected}
      setSelected={setLicensesSelected}
      placeholder="All Licenses"
      label="Licenses"
      allLabel="All Licenses"
    />
    <MultiSelectCombobox
      options={organizations}
      selected={ownersSelected}
      setSelected={setOwnersSelected}
      placeholder="All Development Teams"
      label="Development Teams"
      allLabel="All Development Teams"
    />
    <Button className="w-full" onClick={onApplyFilters}>
      Apply Filters
    </Button>
    <Button className="w-full" variant="outline" onClick={onResetFilters}>
      Reset Filters
    </Button>
  </div>
);

