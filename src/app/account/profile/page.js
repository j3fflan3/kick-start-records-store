import Profile from "@/src/app/_components/profile/Profile";
import NewCustomer from "@/src/app/_components/utilities/NewCustomer";
import {
  serverGetUser,
  serverGetUserOrderList,
} from "@/src/app/_library/server/user";
async function Page() {
  const { data, error } = await serverGetUser();
  const { data: orderList, error: orderListError } =
    await serverGetUserOrderList();
  if (error) {
    console.log(`account profile: ${error.message}`);
    return <NewCustomer />;
  }
  if (orderListError) {
    console.log(`order list error: ${orderListError.message}`);
  }
  const { user } = data;
  return (
    <div>
      <Profile user={user} orders={orderList} />
    </div>
  );
}

export default Page;
