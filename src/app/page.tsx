// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import shadcn Select components
import Link from "next/link";
import { useState } from "react";

interface SearchParams {
  jobTitle: string;
  location: string;
  // keywords: string;
  site: string;
  sortBy: string;
}

export default function Home() {
  const [params, setParams] = useState<SearchParams>({
    jobTitle: "",
    location: "",
    // keywords: "",
    site: "greenhouse",
    sortBy: "any",
  });

  const sites = [
    {
      value: "greenhouse",
      label: "Greenhouse",
      domain: "boards.greenhouse.io",
    },
    { value: "lever", label: "Lever", domain: "jobs.lever.co" },
    { value: "linkedin", label: "LinkedIn", domain: "linkedin.com" },
  ];

  const sortOptions = [
    { value: "any", label: "Any time" },
    { value: "d", label: "Past day" },
    { value: "w", label: "Past week" },
    { value: "m", label: "Past month" },
    { value: "y", label: "Past year" },
  ];

  const handleInputChange = (name: string, value: string) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const generateQuery = () => {
    const { jobTitle, location, site, sortBy } = params;
    const selectedSite = sites.find((s) => s.value === site);
    if (!selectedSite) return "";

    const jobTitles = jobTitle
      .split(",")
      .map((title) => title.trim())
      .filter((title) => title)
      .map((title) => `"${title}"`);
    const jobTitleQuery =
      jobTitles.length > 0 ? `(${jobTitles.join(" OR ")})` : "";

    const locations = location
      .split(",")
      .map((location) => location.trim())
      .filter((location) => location)
      .map((location) => `${location}`);
    const locationsQuery =
      locations.length > 0 ? `${locations.join(" OR ")}` : "";

    const queryParts = [];
    queryParts.push(`site:${selectedSite.domain}`);
    if (jobTitleQuery) queryParts.push(jobTitleQuery);
    if (locationsQuery) queryParts.push(`AND "${locationsQuery}"`);

    const baseQuery = queryParts.join(" ");
    const sortParam = sortBy !== "any" ? `&tbs=qdr:${sortBy}` : "";
    return `https://www.google.com/search?q=${encodeURIComponent(
      baseQuery
    )}${sortParam}`;
  };

  const queryUrl = generateQuery();
  const queryPreview = queryUrl
    ? decodeURIComponent(queryUrl.split("?q=")[1]?.split("&")[0] || "")
    : "Enter parameters to see the query";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md bg-accent">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Job Search Query Generator
        </h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              type="text"
              name="jobTitle"
              value={params.jobTitle}
              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
              placeholder="e.g., Software Engineer, Full-Stack Developer"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={params.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., New York, Remote"
            />
          </div>
          {/* <div className="space-y-2">
            <Label>Keywords</Label>
            <Input
              type="text"
              name="keywords"
              value={params.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              placeholder="e.g., remote senior"
            />
          </div> */}
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-2 w-full">
              <Label>Job Platform</Label>
              <Select
                value={params.site}
                onValueChange={(value) => handleInputChange("site", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.value} value={site.value}>
                      {site.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full">
              <Label>Sort By</Label>
              <Select
                value={params.sortBy}
                onValueChange={(value) => handleInputChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a time range" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Label>Generated Query:</Label>
          <a
            href={queryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {queryPreview || "Enter parameters to generate a query"}
          </a>
        </div>
        {queryUrl && (
          <Button asChild size={"lg"} className="w-full mt-6">
            <Link href={queryUrl} target="_blank" rel="noopener noreferrer">
              Search on Google
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
