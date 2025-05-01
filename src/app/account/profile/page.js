import ProfileList from "../../_components/profile/ProfileList";
import NewCustomer from "../../_components/utilities/NewCustomer";
import { serverGetUser } from "../../_library/serverActions";
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
