import Logo from "@/src/app/_components/header/Logo";
import CartIcon from "@/src/app/_components/shopping-cart/CartIcon";
import { Avatar } from "@/src/app/_components/tailwind/avatar";
import { Link } from "@/src/app/_components/tailwind/link";
import { StackedLayout } from "@/src/app/_components/tailwind/stacked-layout";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/src/app/_components/tailwind/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from "@/src/app/_components/tailwind/sidebar";
import HeaderLoginButton from "@/src/app/_components/header/HeaderLoginButton";

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
