import React from "react";

import UserDetail from "@/app/components/User";

async function page({ params }) {
  const { sub } = params;
  return <div className="p-5 w-full">{sub === "users" && <UserDetail />}</div>;
}

export default page;
