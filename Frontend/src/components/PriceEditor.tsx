import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { PCBuild } from "../types";

interface PriceEditorProps {
  builds: PCBuild[];
  onBackToApp: () => void;
  onSaveBuilds: (builds: PCBuild[]) => void;
}

export default function PriceEditor({
  builds: initialBuilds,
  onBackToApp,
  onSaveBuilds,
}: PriceEditorProps) {
  const [builds, setBuilds] = useState<PCBuild[]>(initialBuilds);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    field: "name" | "ram" | "storage" | "totalCost";
  } | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const buildsPerPage = 15;
  const totalPages = Math.ceil(builds.length / buildsPerPage);
  const startIndex = currentPage * buildsPerPage;
  const endIndex = Math.min(startIndex + buildsPerPage, builds.length);
  const currentBuilds = builds.slice(startIndex, endIndex);

  const handleCellEdit = (
    buildIndex: number,
    field: "name" | "ram" | "storage" | "totalCost"
  ) => {
    const actualIndex = startIndex + buildIndex;
    const build = builds[actualIndex];

    let currentValue = "";
    switch (field) {
      case "name":
        currentValue = build.name;
        break;
      case "ram":
        currentValue = build.components.ram?.name || "";
        break;
      case "storage":
        currentValue = build.components.storage?.name || "";
        break;
      case "totalCost":
        currentValue = build.totalCost.toString();
        break;
    }

    setEditingCell({ row: buildIndex, field });
    setTempValue(currentValue);
  };

  const handleSaveCell = () => {
    if (!editingCell) return;

    const actualIndex = startIndex + editingCell.row;
    const updatedBuilds = [...builds];

    switch (editingCell.field) {
      case "name":
        updatedBuilds[actualIndex].name = tempValue;
        break;
      case "ram":
        updatedBuilds[actualIndex].components.ram.name = tempValue;
        break;
      case "storage":
        updatedBuilds[actualIndex].components.storage.name = tempValue;
        break;
      case "totalCost":
        const newCost = parseFloat(tempValue);
        if (!isNaN(newCost) && newCost > 0) {
          updatedBuilds[actualIndex].totalCost = newCost;
        }
        break;
    }

    setBuilds(updatedBuilds);
    setEditingCell(null);
    setTempValue("");
    setHasChanges(true);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setTempValue("");
  };

  const handleSaveAllBuilds = () => {
    onSaveBuilds(builds);
    setHasChanges(false);
    alert("✅ All builds updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6 relative overflow-hidden">
      {/* 🔹 Rest of your UI remains the same */}
      {/* (Header, Table, Pagination, Summary, Instructions) */}
    </div>
  );
}
