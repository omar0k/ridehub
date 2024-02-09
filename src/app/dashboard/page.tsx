"use client";
import { RedirectToSignUp, auth, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useUser();
  if (!user) {
    <RedirectToSignUp />;
  }
  return (
    <>
      <h1>This is the user dashboard</h1>
    </>
  );
}
