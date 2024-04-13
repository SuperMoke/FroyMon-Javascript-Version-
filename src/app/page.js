"use client"
import React from "react";
import { useRouter } from "next/navigation";

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
    return <div>Loading...</div>;
  }
}
