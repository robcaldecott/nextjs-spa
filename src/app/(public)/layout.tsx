"use client";

import * as React from "react";

export default function PublicLayout(props: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-cyan-500 to-primary">
      {props.children}
    </main>
  );
}
