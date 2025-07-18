import { supabase } from "~/supabase-client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button as NavButton, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import UserDropdown from "./UserDropdown";
import React, { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

export default function AppNavbar() {
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    check();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user;

  return (
    <Navbar isBlurred={false} isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarBrand className="justify-between items-center flex">
          <Link to="/" className="items-center gap-2" onClick={() => !user && setIsMenuOpen(false)}>
            {/* <Icon icon="system-uicons:home-door" width={22} height={22} /> */}
            <HomeIcon />
          </Link>
          {!user && <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden h-8 aspect-square" />}
        </NavbarBrand>
        {!user ? (
          <>
            <NavbarItem className="hidden  sm:flex text-tiny hover:border-b ">
              <Link to="/rejestracja">Rejestracja</Link>
            </NavbarItem>
            <NavbarItem className="hidden sm:flex">
              <NavButton size="sm" as={Link} to="/logowanie" color="primary" variant="solid" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
                Zaloguj
              </NavButton>
            </NavbarItem>
          </>
        ) : (
          <NavbarItem>
            <UserDropdown user={user} />
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu className="space-y-10 font-light">
        <>
          <NavbarMenuItem key="home">
            <Link to="/" className="text-4xl" onClick={() => setIsMenuOpen(false)}>
              Strona Główna
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem key="signup">
            <Link to="/rejestracja" className="text-4xl" onClick={() => setIsMenuOpen(false)}>
              Rejestracja
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem key="login">
            <Button as={Link} onPress={() => setIsMenuOpen(false)} to="/logowanie" color="primary" size="lg" className="w-full">
              Zaloguj się
            </Button>
          </NavbarMenuItem>
        </>
      </NavbarMenu>
    </Navbar>
  );
}

export const HomeIcon = React.memo(() => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" fill-opacity="0.25" d="M5 14.059c0-1.01 0-1.514.222-1.945c.221-.43.632-.724 1.453-1.31l4.163-2.974c.56-.4.842-.601 1.162-.601s.601.2 1.162.601l4.163 2.973c.821.587 1.232.88 1.453 1.311s.222.935.222 1.944V19c0 .943 0 1.414-.293 1.707S17.943 21 17 21H7c-.943 0-1.414 0-1.707-.293S5 19.943 5 19z" />
      <path fill="currentColor" d="M3 12.387c0 .266 0 .4.084.441s.19-.04.4-.205l7.288-5.668c.59-.459.885-.688 1.228-.688s.638.23 1.228.688l7.288 5.668c.21.164.316.246.4.205s.084-.175.084-.441v-.409c0-.48 0-.72-.102-.928s-.291-.356-.67-.65l-7-5.445c-.59-.459-.885-.688-1.228-.688s-.638.23-1.228.688l-7 5.445c-.379.294-.569.442-.67.65S3 11.498 3 11.978zM12.5 15h-1a2 2 0 0 0-2 2v3.85c0 .083.067.15.15.15h4.7a.15.15 0 0 0 .15-.15V17a2 2 0 0 0-2-2" />
      <rect width="2" height="4" x="16" y="5" fill="currentColor" rx=".5" />
    </svg>
  );
});

export const FavoriteIcon = React.memo(() => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" fill-opacity="0.25" stroke="currentColor" d="m4.45 13.908l6.953 6.531c.24.225.36.338.5.366a.5.5 0 0 0 .193 0c.142-.028.261-.14.5-.366l6.953-6.53a5.203 5.203 0 0 0 .549-6.983l-.31-.399c-1.968-2.536-5.918-2.111-7.301.787a.54.54 0 0 1-.974 0C10.13 4.416 6.18 3.99 4.212 6.527l-.31.4a5.203 5.203 0 0 0 .549 6.981Z" stroke-width="1" />
    </svg>
  );
});

export const UserIcon = React.memo(() => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" fill-opacity="0.25" d="M3 12a9 9 0 1 1 18 0a9 9 0 0 1-18 0" />
      <circle cx="12" cy="10" r="4" fill="currentColor" />
      <path fill="currentColor" fill-rule="evenodd" d="M18.22 18.246c.06.097.041.22-.04.297A8.97 8.97 0 0 1 12 21a8.97 8.97 0 0 1-6.18-2.457a.24.24 0 0 1-.04-.297C6.942 16.318 9.291 15 12 15s5.057 1.318 6.22 3.246" clip-rule="evenodd" />
    </svg>
  );
});

export const SignOutIcon = React.memo(() => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g fill="none">
        <path fill="currentColor" fill-opacity="0.25" d="M16.633 6.544L10.316 4.44A1 1 0 0 0 9 5.387v13.226a1 1 0 0 0 1.316.948l6.317-2.105A2 2 0 0 0 18 15.559V8.442a2 2 0 0 0-1.367-1.898" />
        <path stroke="currentColor" stroke-linecap="round" d="M11.5 9.5L14 12m0 0l-2.5 2.5M14 12H4" stroke-width="1" />
      </g>
    </svg>
  );
});

export const SettingsIcon = React.memo(() => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
      <path fill="currentColor" fillOpacity={0.25} fillRule="evenodd" d="M14.136 3.361c-.043-.433-.065-.65-.152-.82a1 1 0 0 0-.521-.47C13.286 2 13.068 2 12.632 2h-1.264c-.436 0-.654 0-.83.07a1 1 0 0 0-.522.472c-.087.169-.109.386-.152.82c-.082.82-.123 1.23-.295 1.455a1 1 0 0 1-.929.385c-.28-.038-.6-.299-1.238-.821c-.337-.276-.506-.414-.687-.472a1 1 0 0 0-.702.035c-.175.075-.33.23-.637.538l-.894.893c-.308.308-.462.463-.538.637a1 1 0 0 0-.035.702c.058.182.196.35.472.688c.523.639.784.958.822 1.239a1 1 0 0 1-.385.928c-.225.172-.635.213-1.456.295c-.434.043-.651.065-.82.152a1 1 0 0 0-.472.521c-.07.177-.07.395-.07.831v1.264c0 .436 0 .654.07.83a1 1 0 0 0 .472.522c.169.087.386.109.82.152c.82.082 1.23.123 1.456.295a1 1 0 0 1 .384.928c-.037.281-.298.6-.82 1.239c-.277.337-.415.506-.473.687a1 1 0 0 0 .035.702c.076.175.23.33.538.637l.894.894c.308.308.462.462.637.538a1 1 0 0 0 .702.035c.181-.058.35-.196.687-.472c.639-.523.958-.784 1.239-.822a1 1 0 0 1 .928.385c.172.225.213.636.295 1.457c.043.433.065.65.152.82a1 1 0 0 0 .521.47c.177.071.395.071.831.071h1.264c.436 0 .654 0 .83-.07a1 1 0 0 0 .522-.471c.087-.17.109-.387.152-.82c.082-.822.123-1.232.295-1.457a1 1 0 0 1 .929-.385c.28.038.6.299 1.238.821c.337.276.506.414.687.472a1 1 0 0 0 .702-.035c.175-.075.33-.23.637-.538l.894-.893c.308-.308.462-.462.538-.637a1 1 0 0 0 .035-.702c-.058-.182-.196-.35-.472-.687c-.522-.639-.783-.958-.821-1.238a1 1 0 0 1 .385-.93c.225-.17.635-.212 1.456-.294c.433-.043.65-.065.82-.152a1 1 0 0 0 .471-.521c.07-.177.07-.395.07-.831v-1.264c0-.436 0-.654-.07-.83a1 1 0 0 0-.472-.522c-.169-.087-.386-.109-.82-.152c-.82-.082-1.23-.123-1.456-.295a1 1 0 0 1-.384-.928c.037-.281.298-.6.82-1.239c.277-.337.415-.506.473-.687a1 1 0 0 0-.035-.702c-.076-.175-.23-.33-.538-.637l-.894-.894c-.308-.308-.462-.462-.637-.538a1 1 0 0 0-.702-.035c-.181.058-.35.196-.687.472c-.639.523-.958.784-1.238.821a1 1 0 0 1-.929-.384c-.172-.225-.213-.636-.295-1.457" clipRule="evenodd"></path>
      <circle cx={12} cy={12} r={3} fill="currentColor"></circle>
    </svg>
  );
});
