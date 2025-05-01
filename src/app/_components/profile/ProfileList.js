import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/src/app/_components/tailwind/description-list";
import Link from "next/link";
import DeleteAccountDialog from "./DeleteAccountDialog";

function ProfileList({ user, userId }) {
  const { email, firstName, lastName, mailingList, notifyList } = user;

  return (
    <>
      <div className="text-xl/6 lg:text-3xl/6 pb-2 pl-1 mb-4 mt-4 font-bold">
        Profile - Personal Information
      </div>
      <DescriptionList className="border p-4 rounded-md dark:border-yellow-600">
        <DescriptionTerm className="text-base">Customer</DescriptionTerm>
        <DescriptionDetails className="text-base">
          {firstName} {lastName}
        </DescriptionDetails>

        <DescriptionTerm className="text-base">Email</DescriptionTerm>
        <DescriptionDetails className="text-base">{email}</DescriptionDetails>

        <DescriptionTerm className="text-base">Mailing List</DescriptionTerm>
        <DescriptionDetails className="text-base">
          {mailingList ? "Yes" : "No"}
        </DescriptionDetails>

        <DescriptionTerm className="text-base">
          Notify me about the grand opening
        </DescriptionTerm>
        <DescriptionDetails className="text-base">
          {notifyList ? "Yes" : "No"}
        </DescriptionDetails>

        {/* <DescriptionTerm></DescriptionTerm>
        <DescriptionDetails>
          <Link
            href="/account/profile/edit"
            className="border border-primary-700 rounded-md text-base py-1 px-6 hover:cursor-pointer inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
          >
            Edit
          </Link>
        </DescriptionDetails> */}
      </DescriptionList>
      <div className="mt-4">
        <Link
          href="/account/profile/edit"
          className="border border-primary-700 rounded-md text-base py-1 px-6 hover:cursor-pointer inline-block hover:bg-accent-600 transition-all hover:text-primary-50"
        >
          Edit
        </Link>
        <DeleteAccountDialog userId={userId} />
      </div>
    </>
  );
}

export default ProfileList;
