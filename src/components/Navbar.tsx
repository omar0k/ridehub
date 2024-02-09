"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import MobileNav from "./MobileNav";
const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            <span>CAR service</span>
          </Link>
          <MobileNav />
          <div className="hidden items-center sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                Pricing
              </Link>
              <SignedOut>
                <SignInButton>
                  <button className={buttonVariants({ variant: "ghost" })}>
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton>
                  <button className={buttonVariants({ variant: "ghost" })}>
                    Sign Out
                  </button>
                </SignOutButton>
              </SignedIn>
              <SignUpButton mode="modal">
                <button className={buttonVariants({ variant: "ghost" })}>
                  Register
                </button>
              </SignUpButton>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
export default Navbar;
