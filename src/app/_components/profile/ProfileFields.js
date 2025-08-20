"use client";
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from "@/src/app/_components/tailwind/checkbox";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/src/app/_components/tailwind/fieldset";
import { Input } from "@/src/app/_components/tailwind/input";
import ComingSoonSmall from "@/src/app/_components/utilities/ComingSoonSmall";
import { clientUpdateUser } from "@/src/app/_library/client/user";
import { useEffect, useState } from "react";
import { validateEmail, validateForm } from "../../_library/utilities";

function ProfileFields({ user, setEditProfile }) {
  const { firstName, lastName, email, mailingList, notifyList } = user;
  const [errors, setErrors] = useState({});
  const [userFirst, setUserFirst] = useState(firstName);
  const [userLast, setUserLast] = useState(lastName);
  const [userEmail, setUserEmail] = useState(email);
  const [userMailing, setUserMailing] = useState(mailingList);
  const [userNotify, setUserNotify] = useState(notifyList);
  const [message, setMessage] = useState("success");
  const [userData, setUserData] = useState({
    firstName: userFirst,
    lastName: userLast,
    email: userEmail,
    mailingList: userMailing,
    notifyList: userNotify,
  });

  useEffect(
    function () {
      setUserData({
        firstName: userFirst,
        lastName: userLast,
        email: userEmail,
        mailingList: userMailing,
        notifyList: userNotify,
      });
    },
    [userFirst, userLast, userEmail, userMailing, userNotify]
  );

  function handleUserFirst(e) {
    setErrors({});
    setUserFirst(e.target.value);
  }
  function handleUserLast(e) {
    setErrors({});
    setUserLast(e.target.value);
  }
  function handleUserEmail(e) {
    setErrors({});
    setUserEmail(e.target.value);
  }
  const requiredValidator = (val) => val !== "";

  async function handleUpdateProfile(e) {
    const validateProfile = validateForm(
      setErrors,
      {
        field: "first_name",
        value: userFirst,
        validator: requiredValidator,
        message: "First name is required.",
      },
      {
        field: "last_name",
        value: userLast,
        validator: requiredValidator,
        message: "Last name is required.",
      },
      {
        field: "email",
        value: userEmail,
        validator: validateEmail,
        message: "Email is invalid/required.",
      }
    );
    console.log(`values: ${JSON.stringify(userData, null, "\t")}`);
    if (validateProfile) {
      const msg = await clientUpdateUser(userData);
      setMessage(msg);
    }
  }

  return (
    <>
      <Fieldset className="mb-4">
        <Legend className="!text-3xl/6 mb-4 mt-4">
          Profile / Update Personal Information
        </Legend>
        <FieldGroup>
          <Field>
            <Label>First Name</Label>
            <Input
              type="text"
              name="first_name"
              value={userFirst}
              onChange={handleUserFirst}
            />
            <p className="ml-2 mt-2 text-sm text-accent-700">
              {errors?.first_name && errors.first_name}
            </p>
          </Field>
          <Field>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="last_name"
              value={userLast}
              onChange={handleUserLast}
            />
            <p className="ml-2 mt-2 text-sm text-accent-700">
              {errors?.last_name && errors.last_name}
            </p>
          </Field>
          <Field>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={userEmail}
              onChange={handleUserEmail}
            />
            <p className="ml-2 mt-2 text-sm text-accent-700">
              {errors?.email && errors.email}
            </p>
          </Field>
        </FieldGroup>
        <CheckboxGroup>
          <CheckboxField>
            <Label>Mailing List</Label>
            <Checkbox
              name="mailing_list"
              value="true"
              checked={userMailing}
              onChange={(e) => setUserMailing(e.target.checked)}
            />
          </CheckboxField>
          <CheckboxField>
            <Label>Notify me of grand opening</Label>
            <Checkbox
              name="notify_list"
              value="true"
              checked={userNotify}
              onChange={(e) => setUserNotify(e.target.checked)}
            />
          </CheckboxField>
        </CheckboxGroup>
      </Fieldset>
      <p className="ml-2 mt-2 text-sm text-accent-700">
        {message !== "success" && message}
      </p>
      <button
        onClick={() => setEditProfile((prev) => !prev)}
        className="border border-primary-700 rounded-md ml-0 px-3 py-2 inline-block hover:bg-accent-600 transition-all hover:text-primary-50 hover:cursor-pointer"
      >
        Cancel
      </button>
      <button
        onClick={async (e) => handleUpdateProfile(e)}
        className="rounded-md ml-4 bg-accent-700 text-primary-50 px-3 py-2 w-[105.333px]  hover:cursor-pointer hover:bg-accent-600 active:bg-accent-500"
      >
        Save
      </button>
    </>
  );
}

export default ProfileFields;
