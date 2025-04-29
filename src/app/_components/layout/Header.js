import Logo from "@/src/app/_components/layout/Logo";
import CartIcon from "../cart/CartIcon";
import { Avatar } from "../tailwind/avatar";
import { Link } from "../tailwind/link";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "../tailwind/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "../tailwind/sidebar";
import { StackedLayout } from "../tailwind/stacked-layout";
import HeaderLoginButton from "./HeaderLoginButton";
import DarkModeToggle from "../buttons/DarkModeToggle";

const navItems = [
  { label: "Records", url: "/records" },
  { label: "Merch", url: "/merchandise" },
  { label: "About", url: "/about" },
];
function Header({ children }) {
  return (
    <StackedLayout
      navbar={
        <div className="flex items-center justify-center w-full">
          <Navbar className="px-10 lg:w-7xl">
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>
            <NavbarDivider className="max-lg:hidden" />
            <NavbarSection className="max-lg:hidden">
              {navItems.map(({ label, url }) => (
                <NavbarItem key={label} href={url}>
                  {label}
                </NavbarItem>
              ))}
            </NavbarSection>
            <NavbarSpacer />
            {/* <NavbarItem aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem> */}
            <NavbarSection className="max-lg:hidden">
              <HeaderLoginButton />
            </NavbarSection>
            <NavbarItem>
              <CartIcon />
            </NavbarItem>
          </Navbar>
        </div>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Avatar
              src="/vinyl-record.png"
              className="w-[20px] h-[20px] ml-2"
            />
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url}>
                  {label}
                </SidebarItem>
              ))}
              <HeaderLoginButton />
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  );
}

export default Header;
