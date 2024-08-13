"use client";

import * as React from "react";
import { login } from "@/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { FormError } from "@/components/form-error";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { LoadingButton } from "@/components/loading-button";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mutation = useMutation<
    { token: string },
    Error,
    { email: string; password: string }
  >({
    mutationFn: (variables) => login(variables.email, variables.password),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        mutation.mutate(
          {
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value,
          },
          {
            onSuccess: (data) => {
              // Redirect to the home page
              Cookies.set("token", data.token);
              router.push(searchParams.get("to") ?? "/");
            },
          },
        );
      }}
    >
      <Card className="m-6 w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              defaultValue="jane.doe@company.com"
              inputMode="email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue="verystrongpassword"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <LoadingButton
            loading={mutation.isPending}
            type="submit"
            className="w-full"
          >
            Sign in
          </LoadingButton>
        </CardFooter>

        {mutation.isError && (
          <CardFooter>
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>{mutation.error.message}</AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}
