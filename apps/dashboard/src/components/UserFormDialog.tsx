"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import {
  updateUserProfile,
  type ActionResult,
} from "@/app/(dashboard)/admin/users/actions";
import type { Profile } from "@ssaucsd/database";

interface UserFormDialogProps {
  user: Profile;
  trigger?: React.ReactElement;
}

export function UserFormDialog({ user, trigger }: UserFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "user">(user.role);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("role", role);

    startTransition(async () => {
      const result: ActionResult = await updateUserProfile(user.id, formData);

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || "An error occurred");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button variant="ghost" size="icon-sm">
              <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user profile information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="first_name">First Name</FieldLabel>
              <Input
                id="first_name"
                name="first_name"
                placeholder="First name"
                defaultValue={user.first_name}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Last name"
                defaultValue={user.last_name}
                required
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="preferred_name">
              Preferred First Name
            </FieldLabel>
            <Input
              id="preferred_name"
              name="preferred_name"
              placeholder="Preferred first name (optional)"
              defaultValue={user.preferred_name || ""}
            />
            <FieldDescription>How they prefer to be called</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
            <FieldDescription>Email cannot be changed</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="instrument">Instrument</FieldLabel>
            <Input
              id="instrument"
              name="instrument"
              placeholder="e.g., Violin, Voice, Piano"
              defaultValue={user.instrument || ""}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="major">Major</FieldLabel>
              <Input
                id="major"
                name="major"
                placeholder="e.g., Computer Science"
                defaultValue={user.major || ""}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="graduation_year">Graduation Year</FieldLabel>
              <Input
                id="graduation_year"
                name="graduation_year"
                type="number"
                min={2020}
                max={2035}
                placeholder="e.g., 2025"
                defaultValue={user.graduation_year || ""}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Select
              value={role}
              onValueChange={(value) => {
                if (value === "admin" || value === "user") {
                  setRole(value);
                }
              }}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Admins can manage events, resources, and users
            </FieldDescription>
          </Field>

          {error && <FieldError>{error}</FieldError>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditUserButton({ user }: { user: Profile }) {
  return (
    <UserFormDialog
      user={user}
      trigger={
        <Button variant="ghost" size="icon-sm">
          <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
        </Button>
      }
    />
  );
}
