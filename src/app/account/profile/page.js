import LoggedInUser from "@/src/app/_components/LoggedInUser";
export const revalidate = 0;
function Page() {
  return (
    <div>
      <LoggedInUser />
    </div>
  );
}

export default Page;
