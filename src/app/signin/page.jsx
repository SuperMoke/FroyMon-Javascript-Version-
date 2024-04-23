"use client";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Button,
  Card,
  Input,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { isAuthenticated } from "../utils/auth";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const roleMap = {
        student: "/user",
        teacher: "/teacher",
        admin: "/admin",
      };
      for (const role of Object.keys(roleMap)) {
        const hasRole = await isAuthenticated(role);
        if (hasRole) {
          router.push(roleMap[role]);
          return;
        }
      }
      console.error("User does not have a valid role");
      // Handle the case where none of the roles match
    } catch (error) {
      console.error("Error signing in:", error);
      // Handle authentication errors
      // ...
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6">
        <div className="flex justify-center">
          <Image
            src="/froymon_logo.png"
            width={200}
            height={200}
            alt="Logo Picture"
          />
        </div>
        <Typography variant="h4" className="mb-6 mt-4 text-center text-black">
          Sign in to your account
        </Typography>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <h2 className="text-black text-sm font-normal mb-2">Email:</h2>
            <Input
              type="email"
              label="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <h2 className="text-black text-sm font-normal mb-2">Password:</h2>
            <Input
              type="password"
              label="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            {isLoading ? (
              <Spinner color="black" size="lg" /> // Increase the size of the spinner
            ) : (
              <Button type="submit" color="black" fullWidth>
                Sign In
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
