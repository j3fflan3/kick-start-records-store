import LeftNavLink from "./LeftNavLink";
import LeftNavLinks from "./LeftNavLinks";
import LeftNavTitle from "./LeftNavTitle";

function LeftNavbar() {
  return (
    <div className="row-span-3 justify-stretch text-left grid place-content-start rounded-md bg-primary-800 p-4">
      <div className="w-full content-start bg-primary-700">
        <LeftNavTitle>Orders</LeftNavTitle>
        <LeftNavLinks>
          <LeftNavLink>View Orders</LeftNavLink>
          <LeftNavLink>Order History</LeftNavLink>
        </LeftNavLinks>
      </div>
      <div className="w-full content-start bg-primary-700">
        <LeftNavTitle>Account</LeftNavTitle>
        <LeftNavLinks>
          <LeftNavLink>Personal Information</LeftNavLink>
          <LeftNavLink>Change Password</LeftNavLink>
          <LeftNavLink>Subscriptions</LeftNavLink>
        </LeftNavLinks>
      </div>
    </div>
  );
}

export default LeftNavbar;
