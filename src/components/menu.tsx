import Link from "next/link";
import { BsBookmarksFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";

interface MenuProps {
  children: React.ReactNode;
  user: User | null | undefined;
}

const Menu = ({ children, user }: MenuProps) => {
  const userItems = [
    {
      label: "Bookmarks",
      href: "/bookmarks",
      icon: <BsBookmarksFill className="icon-menu" />,
    },
    {
      label: "Recipes",
      href: "/recipes",
      icon: <IoFastFoodOutline className="icon-menu" />,
    },
    {
      label: "User",
      href: "/user",
      icon: <FaUserCircle className="icon-menu" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <BiLogOut className="icon-menu" />,
    },
  ];

  return (
    <div className="my-4 flex flex-col gap-4">
      {user ? (
        <div className="flex items-center justify-evenly gap-4">
          <Link href="/">
            <p className="custom-h3">Home</p>
          </Link>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size={"lg"}>{user && user.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userItems.map((item, i) => (
                <DropdownMenuItem key={i}>
                  {item.label === "Logout" ? (
                    <div
                      onClick={() =>
                        signOut({
                          callbackUrl: "/",
                        })
                      }
                      className="flex items-center gap-2"
                    >
                      {item.icon} Logout
                    </div>
                  ) : (
                    <Link href={item.href}>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </div>
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <nav className="flex items-center justify-around">
          <Link href="/">
            <p className="custom-h3">Home</p>
          </Link>
          <ModeToggle />
          <Link href="/recipes">
            <p className="custom-h3">Recipes</p>
          </Link>
        </nav>
      )}

      <div className="container mx-auto p-4">{children}</div>
      <footer className="container mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-t-slate-200 py-10 dark:border-t-slate-700 md:h-24 md:flex-row md:justify-center md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{" "}
              <a
                href="https://github.com/makyfj"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Franklin
              </a>{" "}
              and the source code is available on{" "}
              <a
                href="https://github.com/makyfj/receta.git"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>{" "}
              for anyone interested in exploring.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
