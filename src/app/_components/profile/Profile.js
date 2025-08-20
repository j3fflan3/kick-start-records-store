"use client";
import ProfileList from "@/src/app/_components/profile/ProfileList";
import ProfileFields from "@/src/app/_components/profile/ProfileFields";
import Orders from "@/src/app/_components/profile/Orders";
import Password from "@/src/app/_components/profile/Password";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/src/app/_components/tailwind/sidebar";
import { SidebarLayout } from "@/src/app/_components/tailwind/sidebar-layout";
import { KeyIcon, TicketIcon, UserIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
const PROFILE = "profile";
const ORDERS = "orders";
const PASSWORD = "password";

function Profile({ user }) {
  const [selection, setSelection] = useState(PROFILE);
  const [editProfile, setEditProfile] = useState(false);

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
      {selection === ORDERS && <Orders />}
      {selection === PASSWORD && <Password />}
    </SidebarLayout>
  );
}

export default Profile;
