import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import type { User } from "../types";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function UserAvatar(props: { user: User }) {
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 overflow-hidden rounded-full"
          aria-label="User menu"
        >
          <Image
            className="overflow-hidden rounded-full"
            src={props.user.avatar}
            width={32}
            height={32}
            alt={props.user.name}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>{props.user.name}</span>
          <span className="font-normal">{props.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/login"
            onClick={() => {
              Cookies.remove("token");
              queryClient.clear();
            }}
          >
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
