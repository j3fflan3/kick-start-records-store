import Logo from "@/src/app/_components/layout/Logo";
import CartIcon from "../cart/CartIcon";
import { Link } from "../tailwind/link";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "../tailwind/navbar";
import { StackedLayout } from "../tailwind/stacked-layout";
import HeaderLoginButton from "./HeaderLoginButton";

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
            <HeaderLoginButton />
            <NavbarItem>
              <CartIcon />
            </NavbarItem>
          </Navbar>
        </div>
      }
    >
      {children}
    </StackedLayout>
  );
  // return (
  //   <header className="border-b border-primary-700 px-8 py-5">
  //     <div className="flex justify-between items-center max-w-7xl mx-auto">
  //       <Logo />
  //       <Navigation />
  //     </div>
  //   </header>
  // );
}

export default Header;
