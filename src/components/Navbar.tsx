"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import {
  ClerkLoaded,
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import MobileNav from "./MobileNav";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Icons } from "./Icons";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <nav className="sticky inset-x-0 top-0 z-30 mb-10 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <ClerkLoaded>
          <div className="flex h-14 items-center justify-between border-b border-zinc-200">
            <Link href="/" className="z-40 flex font-semibold">
              <span>RideHub</span>
            </Link>
            <MobileNav />
            <div className="hidden items-center sm:flex">
              <>
                <Link
                  href="/fleet"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Fleet
                </Link>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className={buttonVariants({ variant: "ghost" })}>
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <SignOutButton
                    signOutCallback={() => {
                      router.push("/");
                    }}
                  >
                    <button className={buttonVariants({ variant: "ghost" })}>
                      Sign Out
                    </button>
                  </SignOutButton>
                  <Link
                    href={"/dashboard"}
                    className="aspect-square h-8 w-8 rounded-full bg-slate-400"
                  >
                    <Avatar className="relative h-8 w-8">
                      {user?.imageUrl ? (
                        <div className="relative aspect-square h-full w-full">
                          <Image
                            fill
                            src={user?.imageUrl}
                            alt="profile picture"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <AvatarFallback>
                          <span className="sr-only">{user?.firstName}</span>
                          <Icons.user className="h-4 w-4 text-zinc-900" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className={buttonVariants({ variant: "ghost" })}>
                      Register
                    </button>
                  </SignUpButton>
                </SignedOut>
              </>
            </div>
          </div>
        </ClerkLoaded>
      </MaxWidthWrapper>
    </nav>
  );
};
export default Navbar;
