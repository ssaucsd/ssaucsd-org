"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { completeOnboarding, type ActionState } from "@/app/onboarding/actions";

const initialState: ActionState = {};

export function UserInfoForm() {
  const [state, action, isPending] = useActionState(
    completeOnboarding,
    initialState,
  );

  return (
    <form
      action={action}
      className="space-y-6 bg-card p-6 rounded-xl border shadow-sm"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold font-calistoga">Welcome to SSA!</h2>
        <p className="text-muted-foreground">
          Please provide some basic information to complete your profile.
        </p>
      </div>

      {state.error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm text-center">
          {state.error}
        </div>
      )}

      <Field>
        <FieldLabel htmlFor="preferred_name">Preferred First Name</FieldLabel>
        <Input
          id="preferred_name"
          name="preferred_name"
          placeholder="e.g. Homer"
          required
        />
        {state.errors?.preferred_name && (
          <FieldError>{state.errors.preferred_name[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="instrument">Instrument</FieldLabel>
        <Input
          id="instrument"
          name="instrument"
          placeholder="e.g. Violin"
          required
        />
        {state.errors?.instrument && (
          <FieldError>{state.errors.instrument[0]}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="major">Major</FieldLabel>
        <Input
          id="major"
          name="major"
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
          placeholder="e.g. 2026"
          required
        />
        {state.errors?.graduation_year && (
          <FieldError>{state.errors.graduation_year[0]}</FieldError>
        )}
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Complete Setup"}
      </Button>
    </form>
  );
}
