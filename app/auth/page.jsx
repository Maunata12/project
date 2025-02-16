"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const { status } = useSession();
  const navigate = useRouter();
  if (status === "unauthenticated") {
    navigate.push("/login");
    return;
  }

  if (status === "loading") {
    return <div>Loading</div>;
  }
  async function createuser() {
    await fetch("/api/user/create", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "exist") {
          navigate.push("/");
        } else if (data.message === "created") {
          navigate.push("/");
        } else {
          alert(data?.message);
          signOut();
        }
      });
  }
  useEffect(() => {
    if (status === "authenticated") {
      createuser();
    }
  }, []);

  return <div>Loading</div>;
}

export default page;
