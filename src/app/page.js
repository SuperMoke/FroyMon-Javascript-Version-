"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@material-tailwind/react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = React.useState(null);
  
  React.useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        const data = await response.json();
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  React.useEffect(() => {
    if (session === null) {
      router.push("/signin");
    } else {
      router.push("/user");
    }
  }, [session, router]);

  if (session === null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image
          src="/froymon_logo.png"
          width={200}
          height={200}
          alt="Logo Picture"
        />
        <Spinner className="mt-5 h-12 w-12" />
      </div>
    );
  }
}
