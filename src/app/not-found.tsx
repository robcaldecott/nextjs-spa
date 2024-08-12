import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { CircleX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Card className="m-auto my-6 flex max-w-md flex-col items-center gap-4 p-6">
      <CircleX className="size-10 text-destructive" />
      <h2 className="text-xl font-semibold">404: Not found</h2>
      <Button asChild>
        <Link href="/">Home</Link>
      </Button>
    </Card>
  );
}
