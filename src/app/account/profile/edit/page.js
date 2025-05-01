import ProfileFields from "@/src/app/_components/profile/ProfileFields";
import NewCustomer from "@/src/app/_components/utilities/NewCustomer";
import { serverGetUser } from "@/src/app/_library/serverActions";

async function Page() {
  const { data, error } = await serverGetUser();
  if (error) {
    console.log(error.message);
    return <NewCustomer />;
  }
  const { user } = data;
  return (
    <div className="flex grid-cols-3">
      <div className="xs:hidden sm:w-1/5"></div>
      <div className="w-full sm:w-3/5">
        {user && <ProfileFields user={user.user_metadata} />}
      </div>
      <div className="xs:hidden sm:w-1/5"></div>
    </div>
  );
}

export default Page;
