"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/users");
  }, [router]);

  return <div></div>;
}

export default Page;
