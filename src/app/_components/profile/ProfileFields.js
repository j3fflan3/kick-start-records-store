"use client";
import Link from "next/link";
import { serverUpdateUser } from "../../_library/serverActions";
import SubmitButton from "../buttons/SubmitButton";
import { Checkbox, CheckboxField, CheckboxGroup } from "../tailwind/checkbox";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "../tailwind/fieldset";
import { Input } from "../tailwind/input";
import ComingSoonSmall from "../utilities/ComingSoonSmall";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  message: "",
};

function ProfileFields({ user }) {
  const { firstName, lastName, email, mailingList, notifyList } = user;
  const [errorMessage, setErrorMessage] = useState("");
  const [state, formAction, isPending] = useActionState(
    serverUpdateUser,
    initialState
  );
  useEffect(() => {
    if (state?.message === "error") {
      setErrorMessage("error");
    }
  }, [state]);

  const inDevelopment = false;
  if (inDevelopment) {
    return <ComingSoonSmall />;
  }
  return (
    <form action={formAction}>
      <Fieldset className="mb-4">
        <Legend className="pl-1">Profile / Update Personal Information</Legend>
        <FieldGroup>
          <Field>
            <Label>First Name</Label>
            <Input
              type="text"
              name="firstName"
              defaultValue={firstName}
              required
            />
          </Field>
          <Field>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="lastName"
              defaultValue={lastName}
              required
            />
          </Field>
          <Field>
            <Label>Email</Label>
            <Input type="text" name="email" defaultValue={email} required />
          </Field>
        </FieldGroup>
        <CheckboxGroup>
          <CheckboxField>
            <Label>Mailing List</Label>
            <Checkbox
              name="mailingList"
              value="true"
              defaultChecked={mailingList}
            />
          </CheckboxField>
          <CheckboxField>
            <Label>Notify me of grand opening</Label>
            <Checkbox
              name="notifyList"
              value="true"
              defaultChecked={notifyList}
            />
          </CheckboxField>
        </CheckboxGroup>
      </Fieldset>
      {errorMessage !== "" && (
        <div>
          <p className="text-lg text-red-600 mb-4">
            There was an error updating your profile. Please try again.
          </p>
        </div>
      )}
      <Link
        href="/account/profile"
        className="border border-primary-700 rounded-md ml-0 px-3 py-2 text-2xl inline-block hover:bg-accent-600 transition-all hover:text-primary-50 hover:cursor-pointer"
      >
        Cancel
      </Link>
      <SubmitButton
        cssClasses={`rounded-md ml-4 bg-accent-700 text-primary-50 font-bold px-3 py-2 text-2xl w-[105.333px] h-[48px] hover:cursor-pointer hover:bg-accent-600 active:bg-accent-500`}
      >
        Submit
      </SubmitButton>
      {/* ... */}
    </form>
  );
}

export default ProfileFields;
