import Profile from "@/src/app/_components/profile/Profile";
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
    <div>
      <Profile user={user} />
    </div>
  );
}

export default Page;
