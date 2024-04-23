"use client";
import React, { useEffect, useState } from "react";
import NavbarComponent from "./navbar";
import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../utils/auth";

export default function UserPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const roleMap = {
        student: true,
        teacher: true,
        admin: true,
      };
      for (const role of Object.keys(roleMap)) {
        const authorized = await isAuthenticated(role);
        if (authorized) {
          setIsAuthorized(true);
          return;
        }
      }
      router.push("/");
    };
    checkAuth();
  }, [router]);

  return isAuthorized ? (
    <div className="bg-blue-gray-50 min-h-screen">
      <NavbarComponent />
      <div className="flex flex-col items-center mt-10 h-[calc(100vh-64px)] bg-blue-gray-50 pt-16">
        <Typography variant="h2" className="mb-4 text-center">
          Welcome!
          <br />
          Please pick one to complete the process
        </Typography>
        <div className="flex justify-center space-x-4">
          <Link href="user/user_scanqrcode">
            <Button
              variant="gradient"
              color="blue"
              size="lg"
              className="px-6 py-3"
            >
              Scan QR Code
            </Button>
          </Link>
          <Link href="user/user_pickclassroom">
            <Button
              variant="gradient"
              color="purple"
              size="lg"
              className="px-6 py-3"
            >
              Pick A Classroom
            </Button>
          </Link>
        </div>
      </div>
    </div>
  ) : null;
}
