"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import type { Tag } from "@ssaucsd/database";
import { createTag, updateTag, deleteTag } from "./tag-actions";

interface TagsManagerProps {
  tags: Tag[];
}

export function TagsManager({ tags }: TagsManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    if (!newTagName.trim()) return;
    setError(null);

    const formData = new FormData();
    formData.set("name", newTagName);

    startTransition(async () => {
      const result = await createTag(formData);
      if (result.success) {
        setNewTagName("");
      } else {
        setError(result.error || "Failed to create tag");
      }
    });
  };

  const handleUpdate = (id: string) => {
    if (!editingName.trim()) return;
    setError(null);

    const formData = new FormData();
    formData.set("name", editingName);

    startTransition(async () => {
      const result = await updateTag(id, formData);
      if (result.success) {
        setEditingId(null);
        setEditingName("");
      } else {
        setError(result.error || "Failed to update tag");
      }
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteTag(id);
      if (!result.success) {
        setError(result.error || "Failed to delete tag");
      }
    });
  };

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Manage Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Tag */}
        <div className="flex gap-2">
          <Input
            placeholder="New tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            disabled={isPending}
            className="flex-1"
          />
          <Button
            onClick={handleCreate}
            disabled={isPending || !newTagName.trim()}
            size="icon"
          >
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Tags List */}
        <div className="space-y-2">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tags yet. Create one above.
            </p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                {editingId === tag.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(tag.id);
                        if (e.key === "Escape") cancelEditing();
                      }}
                      disabled={isPending}
                      className="flex-1 h-8"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleUpdate(tag.id)}
                      disabled={isPending || !editingName.trim()}
                    >
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="h-4 w-4 text-green-600"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={cancelEditing}
                      disabled={isPending}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {tag.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => startEditing(tag)}
                      disabled={isPending}
                    >
                      <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(tag.id)}
                      disabled={isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
