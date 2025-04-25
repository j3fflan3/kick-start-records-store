"use client";
import { useActionState, useEffect, useState } from "react";
import { serverUpdateUser } from "../../_library/serverActions";
import SubmitButton from "../buttons/SubmitButton";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "../tailwind/fieldset";
import { Input } from "../tailwind/input";
import { useRouter } from "next/navigation";
import { Checkbox, CheckboxField, CheckboxGroup } from "../tailwind/checkbox";
import ComingSoonSmall from "../ComingSoonSmall";

const initialState = {
  message: "",
};

function ProfileFields({ user, setEdit }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    serverUpdateUser,
    initialState
  );
  const [successMessage, setSuccessMessage] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [mailingList, setMailingList] = useState(user.mailingList === "on");
  const [notifyList, setNotifyList] = useState(user.notifyList === "on");
  const isSubmittable =
    firstName !== "" && lastName !== "" && email !== "" && !isPending;
  useEffect(() => {
    if (state) {
      const { message } = state;
      console.log(message);
      if (
        message === "success" &&
        typeof window !== "undefined" &&
        !successMessage
      ) {
        setSuccessMessage(true);
        console.log("before router.push...");
        router.push("/account/profile");
      }
    }
  }, [state, router, successMessage]);

  function handleFirstName(e) {
    setFirstName(e.target.value);
  }
  function handleLastName(e) {
    setLastName(e.target.value);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }

  const inDevelopment = true;
  //   //   function handleMailingList(e) {
  //   //     setMailingList(e.target.value);
  //   //   }
  //   //   function handleNotifyList(e) {
  //   //     setNotifyList(e.target.value);
  //   //   }
  if (inDevelopment) {
    return <ComingSoonSmall callback={() => setEdit(false)} />;
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
              value={firstName}
              onChange={handleFirstName}
            />
          </Field>
          <Field>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleLastName}
            />
          </Field>
          <Field>
            <Label>Email</Label>
            <Input
              type="text"
              name="email"
              value={email}
              onChange={handleEmail}
            />
          </Field>
        </FieldGroup>
        <CheckboxGroup>
          <CheckboxField>
            <Label>Mailing List</Label>
            <Checkbox
              name="mailingList"
              value={mailingList}
              onChange={setMailingList}
              defaultChecked={mailingList}
              checked={mailingList}
            />
          </CheckboxField>
          <CheckboxField>
            <Label>Notify me of grand opening</Label>
            <Checkbox
              name="notifyList"
              value={notifyList}
              onChange={setNotifyList}
              defaultChecked={notifyList}
              checked={notifyList}
            />
          </CheckboxField>
        </CheckboxGroup>
      </Fieldset>
      <button
        onClick={() => setEdit(false)}
        className="border border-primary-700 rounded-md ml-2 px-3 py-2 text-2xl inline-block hover:bg-accent-600 transition-all hover:text-primary-50 hover:cursor-pointer"
      >
        Cancel
      </button>
      <SubmitButton
        disabled={!isSubmittable}
        cssClasses={
          isSubmittable
            ? `rounded-md ml-4 bg-accent-700 text-primary-50 font-bold px-3 py-2 text-2xl hover:cursor-pointer hover:bg-accent-600 active:bg-accent-500`
            : `rounded-md ml-4 bg-primary-500 font-bold px-3 py-2 text-2xl `
        }
      >
        Submit
      </SubmitButton>
      {/* ... */}
    </form>
  );
}

export default ProfileFields;
