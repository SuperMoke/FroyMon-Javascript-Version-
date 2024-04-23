"use client";
import React, { useState, useEffect } from "react";
import NavbarComponent from "./navbar";
import { Button, Typography } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../utils/auth";

export default function TeacherPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await isAuthenticated("teacher");
      setIsAuthorized(authorized);
      if (!authorized) {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  return isAuthorized ? (
    <div className="bg-blue-gray-50 min-h-screen">
      <NavbarComponent />
      <div className="flex flex-col items-center mt-10 h-[calc(100vh-64px)] bg-blue-gray-50 pt-16">
        <Typography variant="h2" className="mb-4 text-center">
          Welcome! Teacher
        </Typography>
        <div className="flex justify-center space-x-4">
          <Link href="teacher/teacher_generatelobby">
            <Button
              variant="gradient"
              color="blue"
              size="lg"
              className="px-6 py-3"
            >
              Generate Virtual Lobby
            </Button>
          </Link>
          <Link href="teacher/teacher_viewattendance">
            <Button
              variant="gradient"
              color="purple"
              size="lg"
              className="px-6 py-3"
            >
              View Attendance Form
            </Button>
          </Link>
        </div>
      </div>
    </div>
  ) : null;
}
