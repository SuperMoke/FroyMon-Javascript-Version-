"use client";
import React, { useState, useEffect } from "react";
import NavbarComponent from "../navbar";
import {
  Avatar,
  Button,
  Card,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../utils/auth";

export default function Admin_CreateUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await isAuthenticated("admin");
      setIsAuthorized(authorized);
      if (!authorized) {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential;
      console.log("User created successfully!", user);

      await addDoc(collection(db, "user"), {
        name: name,
        email: email,
        role: role,
      });
      setEmail("");
      setPassword("");
      setRole("");
      setName("");

      console.log("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  return isAuthorized ? (
    <>
      <>
        <div className="bg-blue-gray-50 min-h-screen">
          <NavbarComponent />
          <div className="flex flex-col items-center h-[calc(100vh-64px)] bg-blue-gray-50 pt-16">
            <Typography variant="h2" className="mb-4 text-center">
              Admin Create User
            </Typography>
            <Card className="w-96 p-8">
              <form
                className="flex flex-col space-y-2"
                onSubmit={handleFormSubmit}
              >
                <Typography color="gray" className="font-normal mt-2 mb-2">
                  Student Name:
                </Typography>
                <Input
                  type="text"
                  label="Enter The Student Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                ></Input>
                <Typography className="font-normal mb-2">Email:</Typography>
                <Input
                  type="email"
                  label="Enter The CCA Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ></Input>
                <Typography className="font-normal mb-2">Password:</Typography>
                <Input
                  type="password"
                  label="Enter The Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                ></Input>
                <Typography className="font-normal mb-2">Role:</Typography>
                <Select
                  label="Select Role"
                  value={role}
                  onChange={(e) => setRole(e)}
                  required
                >
                  <Option value="student">Student</Option>
                  <Option value="teacher">Teacher</Option>
                </Select>
                <Button type="submit">Create</Button>
              </form>
            </Card>
          </div>
        </div>
      </>
    </>
  ) : null;
}
