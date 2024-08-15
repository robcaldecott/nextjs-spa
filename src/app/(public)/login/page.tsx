"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { login } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
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

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mutation = useMutation<{ token: string }, Error, LoginFormData>({
    mutationFn: (variables) => login(variables.email, variables.password),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutation.mutate(data, {
          onSuccess: (data) => {
            Cookies.set("token", data.token);
            // Redirect
            router.push(searchParams.get("to") ?? "/");
          },
        });
      })}
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
              type="text"
              defaultValue="jane.doe@company.com"
              inputMode="email"
              {...register("email")}
            />
            {errors.email && <FormError>{errors.email.message}</FormError>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              defaultValue="verystrongpassword"
              {...register("password")}
            />
            {errors.password && (
              <FormError>{errors.password.message}</FormError>
            )}
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
