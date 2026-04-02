"use client";
import ProfileList from "@/src/app/components/profile/ProfileList";
import ProfileFields from "@/src/app/components/profile/ProfileFields";
import Orders from "@/src/app/components/profile/Orders";
import UserOrderDetails from "@/src/app/components/profile/UserOrderDetails";
import ResetPasswordForm from "@/src/app/components/login/ResetPasswordForm";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/src/app/components/tailwind/sidebar";
import { SidebarLayout } from "@/src/app/components/tailwind/sidebar-layout";
import { KeyIcon, TicketIcon, UserIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

// Used for navigation
const PROFILE = "profile";
const ORDERS = "orders";
const PASSWORD = "password";
const ORDER_DETAILS = "order_details";

function Profile({ user, orders }) {
  const [selection, setSelection] = useState(PROFILE);
  const [editProfile, setEditProfile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  function viewSelectedOrderDetails(order) {
    setSelectedOrder(order);
    setSelection(ORDER_DETAILS);
  }
  function backToOrders() {
    setSelection(ORDERS);
    setSelectedOrder({});
  }
  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarBody className="fixed left-60 top-36">
            <SidebarSection>
              <SidebarItem>
                <UserIcon />
                <SidebarLabel
                  onClick={() => {
                    setSelection(PROFILE);
                  }}
                >
                  Profile
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <TicketIcon />
                <SidebarLabel
                  onClick={() => {
                    setSelection(ORDERS);
                  }}
                >
                  Orders
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem>
                <KeyIcon />
                <SidebarLabel
                  onClick={() => {
                    setSelection(PASSWORD);
                  }}
                >
                  Password
                </SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {selection === PROFILE &&
        (!editProfile ? (
          <ProfileList
            user={user.user_metadata}
            userId={user.id}
            setEditProfile={setEditProfile}
          />
        ) : (
          <ProfileFields
            user={user.user_metadata}
            setEditProfile={setEditProfile}
          />
        ))}
      {selection === ORDERS && (
        <Orders
          user={user.user_metadata}
          orders={orders}
          viewDetails={viewSelectedOrderDetails}
        />
      )}
      {selection === ORDER_DETAILS && (
        <UserOrderDetails order={selectedOrder} back={backToOrders} />
      )}
      {selection === PASSWORD && <ResetPasswordForm />}
    </SidebarLayout>
  );
}

export default Profile;
