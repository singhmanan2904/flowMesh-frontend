"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

type FormErrors = { 
    username?: string
    password?: string
    failedLogin?: boolean
  }

function LoginForm() {
    const router = useRouter()
    const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (data: {
    username: string
    password: string
    failedLogin?: boolean
  }) => {
    const newErrors: FormErrors = {}
    if(!data.username || !data.password) {
      newErrors.username = "Username is required"
      newErrors.password = "Password is required"
    }
    if(data.password.length < 5) {
      newErrors.password = "Password must be at least 8 characters long"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData) as {
      username: string
      password: string
    }

    if(!validateForm(data)) {
      return
    }
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      )
      
      if (response.ok) {
        router.push("/")
        return
      }

      setErrors((prev) => ({ ...prev, failedLogin: true }))
    } catch {
      setErrors((prev) => ({ ...prev, failedLogin: true }))
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
          </div>
          {(errors?.username || errors?.password) && (
            <FieldError className="m-2">Please fill in all fields</FieldError>
          )}
          {(errors?.failedLogin) && (
            <FieldError className="m-2">Invalid username or password</FieldError>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" type="button" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default LoginForm