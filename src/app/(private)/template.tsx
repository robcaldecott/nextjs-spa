"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

export default function AuthTemplate(props: { children: React.ReactNode }) {
  const [token] = React.useState(Cookies.get("token"));
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!token) {
      router.push(`/login?to=${pathname}`);
    }
  }, [pathname, router, token]);

  return token ? props.children : null;
}
