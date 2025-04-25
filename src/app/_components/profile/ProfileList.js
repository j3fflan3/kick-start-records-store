"use client";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/src/app/_components/tailwind/description-list";
import { Legend } from "../tailwind/fieldset";

function ProfileList({ user, setEdit }) {
  const { email, firstName, lastName, mailingList, notifyList } = user;
  const bMailingList = mailingList && Boolean(mailingList);
  const bNotifyList = notifyList && Boolean(notifyList);
  console.log(user);
  return (
    <>
      <div className="text-base/6 pb-2 font-bold">
        Profile / Personal Information
      </div>
      <DescriptionList className="border px-2 rounded-md">
        <DescriptionTerm>Customer</DescriptionTerm>
        <DescriptionDetails>
          {firstName} {lastName}
        </DescriptionDetails>

        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>{email}</DescriptionDetails>

        <DescriptionTerm>Mailing List</DescriptionTerm>
        <DescriptionDetails>{bMailingList ? "Yes" : "No"}</DescriptionDetails>

        <DescriptionTerm>Notify me about the grand opening</DescriptionTerm>
        <DescriptionDetails>{bNotifyList ? "Yes" : "No"}</DescriptionDetails>

        <DescriptionTerm></DescriptionTerm>
        <DescriptionDetails>
          <button
            onClick={() => setEdit(true)}
            className="border border-primary-700 rounded-md text-base py-1 px-6 hover:cursor-pointer inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
          >
            Edit
          </button>
        </DescriptionDetails>
      </DescriptionList>
    </>
  );
}

export default ProfileList;
