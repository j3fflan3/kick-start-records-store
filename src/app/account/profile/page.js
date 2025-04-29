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
      <div className="w-1/4"></div>
      <div className="w-1/2">
        {user && <ProfileList user={user.user_metadata} userId={user.id} />}
      </div>
      <div className="w-1/4"></div>
    </div>
  );
}

export default Page;
