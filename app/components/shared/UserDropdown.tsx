import { Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownSection, DropdownItem, user, Button } from "@heroui/react";
import { FavoriteIcon, SignOutIcon } from "./Navbar";
import { Link as RouterLink } from "react-router";
import { supabase } from "~/supabase-client";
import type { User } from "@supabase/supabase-js";
import { Icon } from "@iconify/react";

type Props = {
  user: User;
};

export default function UserDropdown({ user }: Props) {
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.reload();
  }

  return (
    <Dropdown
      classNames={{
        base: "before:bg-default-200",
        content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
      }}
      backdrop="opaque"
      showArrow
      className="max-w-fit"
      placement="bottom-end"
    >
      <DropdownTrigger>
        <button className="cursor-pointer">
          <Avatar size="sm" isBordered showFallback src="https://api.dicebear.com/7.x/initials/svg?seed=John+Doe" />
        </button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownSection>
          <DropdownItem key="profile" startContent={<Icon icon="system-uicons:user-male-circle" width={21} height={21} />}>
            {user.user_metadata.displayName}
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title={"Linki"}>
          <DropdownItem key="home" startContent={<Icon icon="system-uicons:home-door" width={21} height={21} />}>
            <RouterLink to="/" className="!text-foreground">
              Strona Główna
            </RouterLink>
          </DropdownItem>
          {/* <DropdownItem key="favorites" startContent={<Icon icon="system-uicons:heart" width={21} height={21} />}>
            <RouterLink to="/ulubione" className="!text-foreground">
              Ulubione
            </RouterLink>
          </DropdownItem> */}
        </DropdownSection>
        <DropdownSection title="Akcje Użytkownika">
          <DropdownItem key="logout" startContent={<SignOutIcon />} color="danger" onClick={signOut}>
            Wyloguj
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
