import * as React from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, X } from "lucide-react";

interface MultiSelectComboboxProps {
  options: string[];
  selected: string[];
  setSelected: (v: string[]) => void;
  placeholder?: string;
  label?: string;
  getLabel?: (value: string) => string;
  allLabel?: string; // e.g. 'All Licenses'
}

export function MultiSelectCombobox({ options, selected, setSelected, placeholder, label, getLabel, allLabel }: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Sort options: selected first (in their original order), then unselected (in their original order)
  const sortedOptions = [
    ...options.filter(option => selected.includes(option)),
    ...options.filter(option => !selected.includes(option)),
  ];

  return (
    <div>
      {label && <h3 className="font-medium mb-2">{label}</h3>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full flex flex-row flex-wrap items-center justify-between text-left min-h-10 px-3 h-auto"
            style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
          >
            <span className="flex flex-wrap gap-2 items-center flex-1 min-h-6">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{allLabel || placeholder || "Select..."}</span>
              ) : (
                selected.map((v) => (
                  <span key={v} className="inline-flex items-center bg-gray-100 rounded px-2 py-1 text-sm font-medium">
                    <span
                      role="button"
                      tabIndex={0}
                      className="mr-1 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                      onClick={e => { e.stopPropagation(); setSelected(selected.filter((s) => s !== v)); }}
                      aria-label={`Remove ${getLabel ? getLabel(v) : v}`}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(selected.filter((s) => s !== v)); } }}
                    >
                      <X className="w-3 h-3" />
                    </span>
                    {getLabel ? getLabel(v) : v}
                  </span>
                ))
              )}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-w-full p-0 sm:w-full sm:max-w-xs md:w-full md:max-w-sm lg:max-w-md" align="start" sideOffset={4} style={{ minWidth: 0 }}>
          <Command>
            <CommandInput placeholder={placeholder || allLabel || "Search..."} />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandItem
                key="__all__"
                onSelect={() => setSelected([])}
                value="__all__"
                className={selected.length === 0 ? "font-semibold" : ""}
              >
                <Check className={selected.length === 0 ? "mr-2 h-4 w-4 opacity-100" : "mr-2 h-4 w-4 opacity-0"} />
                {allLabel || "All"}
              </CommandItem>
              {sortedOptions.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    setSelected(
                      selected.includes(option)
                        ? selected.filter((v) => v !== option)
                        : [...selected, option]
                    );
                  }}
                >
                  <Check
                    className={
                      selected.includes(option)
                        ? "mr-2 h-4 w-4 opacity-100"
                        : "mr-2 h-4 w-4 opacity-0"
                    }
                  />
                  {getLabel ? getLabel(option) : option}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
} 