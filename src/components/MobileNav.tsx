"use client";

import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MobileNav = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />

      {isOpen ? (
        <div className="fixed inset-0 z-0 w-full animate-in fade-in-20 slide-in-from-top-5">
          <ul className="absolute grid w-full gap-3 border-b border-zinc-200 bg-white px-10 pb-8 pt-20 font-semibold shadow-xl">
            <SignedOut>
              <>
                <li className="w-full">
                  <SignInButton>Sign In</SignInButton>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    className="flex w-full items-center font-semibold"
                    href="/about"
                  >
                    About
                  </Link>
                </li>
              </>
            </SignedOut>
            <SignedIn>
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    className="flex w-full items-center font-semibold"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-gray-300" />
                <li className="font-semibold">
                  <SignOutButton>Sign out</SignOutButton>
                </li>
              </>
            </SignedIn>
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
