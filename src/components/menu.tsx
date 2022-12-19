import Link from "next/link";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BsBookmarksFill } from "react-icons/bs";
import { FaUserCircle, FaGithub } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { IoFastFoodOutline } from "react-icons/io5";
import { signOut } from "next-auth/react";

import { User } from "@prisma/client";

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
    <>
      {user ? (
        <div className="flex items-center justify-evenly gap-4">
          <Link href="/">
            <p className="custom-nav">Home</p>
          </Link>
          <HeadlessMenu as="div" className="relative inline-block text-left">
            <div>
              <HeadlessMenu.Button className="flex w-full items-center justify-center gap-2 rounded-md bg-black bg-opacity-60 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {user.name}
                {user.image && (
                  <img
                    src={user.image as string}
                    alt="avatar"
                    className="mx-auto h-10 w-10 rounded-full"
                  />
                )}
              </HeadlessMenu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <HeadlessMenu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-stone-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  {userItems.map((item) => (
                    <HeadlessMenu.Item key={item.label}>
                      {({ active }) => (
                        <div
                          className={`${
                            active ? "bg-gray-600 text-white" : "text-gray-900"
                          } text-md group flex w-full items-center rounded-md px-2 py-2`}
                        >
                          {item.label === "Logout" ? (
                            <button
                              onClick={() =>
                                signOut({
                                  callbackUrl: "/",
                                })
                              }
                              className="flex items-center gap-2"
                            >
                              {item.icon} Logout
                            </button>
                          ) : (
                            <Link href={item.href}>
                              <div className="flex items-center gap-2">
                                {item.icon}
                                {item.label}
                              </div>
                            </Link>
                          )}
                        </div>
                      )}
                    </HeadlessMenu.Item>
                  ))}
                </div>
              </HeadlessMenu.Items>
            </Transition>
          </HeadlessMenu>
        </div>
      ) : (
        <nav className="flex items-center justify-around">
          <Link href="/">
            <p className="custom-nav">Home</p>
          </Link>
          <Link href="/recipes">
            <p className="custom-nav">Recipes</p>
          </Link>
        </nav>
      )}

      <div className="container mx-auto p-4">{children}</div>

      <hr className="border border-stone-700" />
      <footer className="flex justify-around">
        <a
          href="https://github.com/makyfj/receta.git"
          target="_blank"
          rel="noreferrer"
        >
          <h3 className="custom-nav flex items-center gap-2">
            Source Code <FaGithub className="text-stone-800" />
          </h3>
        </a>
      </footer>
    </>
  );
};

export default Menu;
