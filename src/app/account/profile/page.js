import ProfileList from "@/src/app/_components/profile/ProfileList";
import NewCustomer from "@/src/app/_components/utilities/NewCustomer";
import { serverGetUser } from "@/src/app/_library/server/user";

async function Page() {
  const { data, error } = await serverGetUser();
  if (error) {
    console.log(`account profile: ${error.message}`);
    return <NewCustomer />;
  }
  const { user } = data;
  return (
    <div className="flex grid-cols-3">
      <div className="xs:hidden sm:w-1/5"></div>
      <div className="w-full sm:w-3/5">
        {user && <ProfileList user={user.user_metadata} userId={user.id} />}
      </div>
      <div className="xs:hidden sm:w-1/5"></div>
    </div>
  );
}

export default Page;
