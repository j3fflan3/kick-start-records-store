import LoggedInUser from "@/src/app/_components/profile/LoggedInUser";
import ProfileNavbar from "@/src/app/_components/profile/ProfileNavbar";
export const revalidate = 0;
function Page() {
  return (
    <div className="grid grid-flow-col grid-rows-3 gap-4">
      <ProfileNavbar />
      <LoggedInUser />
    </div>
  );
}

export default Page;
