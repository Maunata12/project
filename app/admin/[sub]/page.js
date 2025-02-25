import React from "react";
import Check from "./checking";

async function Page({ params }) {
  const { sub } = params;
  const optionList = ["room", "users"];

  if (!optionList.includes(sub)) {
    return <h1>404 - Not Found</h1>;
  }

  return <Check sub={sub} />;
}

export default Page;