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
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const db = getFirestore();
      const userQuery = query(
        collection(db, "user"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const role = userData.role;
          if (role === "student") {
            router.push("/user");
          } else if (role === "teacher") {
            router.push("/teacher");
          } else if (role === "admin") {
            router.push("/admin");
          } else {
            console.error("Unknown role:", role);
          }
        });
      } else {
        console.error("User not found or role not specified");
      }
    } catch (error) {
      console.error("Error signing in:", error);
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
          <Button type="submit" fullWidth>
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
