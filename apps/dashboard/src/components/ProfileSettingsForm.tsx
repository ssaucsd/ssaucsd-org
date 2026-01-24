"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  updateProfile,
  type ActionState,
} from "@/app/(dashboard)/settings/actions";
import { toast } from "sonner";
import { useEffect } from "react";

const initialState: ActionState = {};

type Profile = {
  preferred_name: string | null;
  major: string | null;
  graduation_year: number | null;
  instrument: string | null;
};

export function ProfileSettingsForm({ profile }: { profile: Profile }) {
  const [state, action, isPending] = useActionState(
    updateProfile,
    initialState,
  );

  // Use controlled inputs to avoid Base UI uncontrolled/controlled warning
  const [preferredName, setPreferredName] = useState(
    profile.preferred_name || "",
  );
  const [major, setMajor] = useState(profile.major || "");
  const [graduationYear, setGraduationYear] = useState(
    profile.graduation_year?.toString() || "",
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={action} className="space-y-6">
      <Field>
        <FieldLabel htmlFor="preferred_name">Preferred First Name</FieldLabel>
        <Input
          id="preferred_name"
          name="preferred_name"
          value={preferredName}
          onChange={(e) => setPreferredName(e.target.value)}
          placeholder="e.g. Homer"
          required
        />
        {state.errors?.preferred_name && (
          <FieldError>{state.errors.preferred_name[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="major">Major</FieldLabel>
        <Input
          id="major"
          name="major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="e.g. Computer Science"
          required
        />
        {state.errors?.major && (
          <FieldError>{state.errors.major[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="graduation_year">Graduation Year</FieldLabel>
        <Input
          id="graduation_year"
          name="graduation_year"
          type="number"
          min="2000"
          max="2100"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
          placeholder="e.g. 2026"
          required
        />
        {state.errors?.graduation_year && (
          <FieldError>{state.errors.graduation_year[0]}</FieldError>
        )}
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
