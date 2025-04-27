import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/src/app/_components/tailwind/description-list";
import Link from "next/link";

function ProfileList({ user }) {
  const { email, firstName, lastName, mailingList, notifyList } = user;

  console.log(user);
  return (
    <>
      <div className="text-base/6 pb-2 pl-1 font-bold">
        Profile - Personal Information
      </div>
      <DescriptionList className="border px-2 rounded-md">
        <DescriptionTerm>Customer</DescriptionTerm>
        <DescriptionDetails>
          {firstName} {lastName}
        </DescriptionDetails>

        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>{email}</DescriptionDetails>

        <DescriptionTerm>Mailing List</DescriptionTerm>
        <DescriptionDetails>{mailingList ? "Yes" : "No"}</DescriptionDetails>

        <DescriptionTerm>Notify me about the grand opening</DescriptionTerm>
        <DescriptionDetails>{notifyList ? "Yes" : "No"}</DescriptionDetails>

        <DescriptionTerm></DescriptionTerm>
        <DescriptionDetails>
          <Link
            href="/account/profile/edit"
            className="border border-primary-700 rounded-md text-base py-1 px-6 hover:cursor-pointer inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
          >
            Edit
          </Link>
        </DescriptionDetails>
      </DescriptionList>
    </>
  );
}

export default ProfileList;
