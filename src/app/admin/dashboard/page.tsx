"use client";
import { auth, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useUser();
  useEffect(() => {
    if (user && user.publicMetadata.role !== "admin") {
      redirect("/");
    }
  }, [user]);
  if (!user) {
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    ); 
  }
  return (
    <>
      <h1>This is the admin dashboard</h1>
      <p>This page is restricted to users with the 'admin' role.</p>
    </>
  );
}
