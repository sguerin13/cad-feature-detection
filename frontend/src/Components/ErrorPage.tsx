import React from "react";
import { useRouteError } from "react-router-dom";
import Page from "./Page";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Page>
      <div className="min-h-screen h-full w-full flex flex-col justify-center items-center">
        <div>Woops, Wrong Route</div>
        <div>Error Mesage:{" "}`{(error as any).statusText || (error as any).message}`</div>
        <a href="/" className="text-blue-500">
          Go Home
        </a>
      </div>
    </Page>
  );
}
