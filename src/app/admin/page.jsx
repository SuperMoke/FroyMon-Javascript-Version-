"use client";
import React, { useState, useEffect } from "react";
import NavbarComponent from "./navbar";
import {
  Typography,
  Button,
  Card,
  Select,
  Option,
} from "@material-tailwind/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../utils/auth";

export default function AdminPage() {
  const [statusCounts, setStatusCounts] = useState({
    hardwareIssues: 0,
    softwareIssues: 0,
    networkProblems: 0,
    fullyFunctional: 0,
  });
  const [selectedLab, setSelectedLab] = useState("");
  const [labEntries, setLabEntries] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "studententries"));
        const counts = {
          hardwareIssues: 0,
          softwareIssues: 0,
          networkProblems: 0,
          fullyFunctional: 0,
        };

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.computerStatus === "Hardware Issues") {
            counts.hardwareIssues++;
          } else if (data.computerStatus === "Software Issues") {
            counts.softwareIssues++;
          } else if (data.computerStatus === "Network Problems") {
            counts.networkProblems++;
          } else if (data.computerStatus === "Computer is Full Functional") {
            counts.fullyFunctional++;
          }
        });

        setStatusCounts(counts);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  const handleLabSelect = async (value) => {
    setSelectedLab(value);

    try {
      const q = query(
        collection(db, "studententries"),
        where("computerLab", "==", value)
      );
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map((doc) => doc.data());
      setLabEntries(entries);
    } catch (error) {
      console.error("Error fetching lab entries from Firestore:", error);
    }
  };

  return isAuthorized ? (
    <div className="bg-blue-gray-50 min-h-screen">
      <NavbarComponent />
      <div className="flex flex-col items-center h-[calc(100vh-64px)] bg-blue-gray-50 pt-5">
        <h2 className="text-center text-4xl font-bold mb-5">Admin DashBoard</h2>
        <div>
          <h2 className="text-center text-2xl font-bold mb-3">
            Computer Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="w-full max-w-[24rem] bg-white shadow-lg rounded-xl p-6">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-3 text-center"
              >
                Hardware Issues
              </Typography>
              <Typography className="text-center text-2xl font-bold">
                {statusCounts.hardwareIssues}
              </Typography>
            </Card>
            <Card className="w-full max-w-[24rem] bg-white shadow-lg rounded-xl p-6">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-3 text-center"
              >
                Software Issues
              </Typography>
              <Typography className="text-center text-2xl font-bold">
                {statusCounts.softwareIssues}
              </Typography>
            </Card>
            <Card className="w-full max-w-[24rem] bg-white shadow-lg rounded-xl p-6">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-3 text-center"
              >
                Network Problems
              </Typography>
              <Typography className="text-center text-2xl font-bold">
                {statusCounts.networkProblems}
              </Typography>
            </Card>
            <Card className="w-full max-w-[24rem] bg-white shadow-lg rounded-xl p-6">
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-3 text-center"
              >
                Computer is Fully Functional
              </Typography>
              <Typography className="text-center text-2xl font-bold">
                {statusCounts.fullyFunctional}
              </Typography>
            </Card>
          </div>
        </div>
        <div className="flex justify-center items-center mt-15">
          <div className="w-full px-14 sm:px-20 py-4">
            <Select
              className="w-96"
              label="Select Computer Laboratory"
              placeholder={undefined}
              onChange={(value) => handleLabSelect(value)}
            >
              <Option value="CLAB1">Computer Laboratory 1</Option>
              <Option value="CLAB2">Computer Laboratory 2</Option>
              <Option value="CLAB3">Computer Laboratory 3</Option>
              <Option value="CLAB4">Computer Laboratory 4</Option>
              <Option value="CLAB5">Computer Laboratory 5</Option>
              <Option value="CLAB6">Computer Laboratory 6</Option>
              <Option value="CiscoLab">CISCO Laboratory</Option>
              <Option value="AccountingLab">Accounting Laboratory</Option>
              <Option value="HardwareLab">Hardware Laboratory</Option>
              <Option value="ContactCenterLab">
                Contact Center Laboratory
              </Option>
            </Select>
          </div>
        </div>
        <Card className="w-[1000px] h-[500px] text-center flex items-start justify-start p-4">
          <div className="flex flex-wrap justify-start">
            {labEntries.map((entry, index) => (
              <Card
                key={index}
                className="text-center flex items-center mb-4 mr-4"
              >
                <div className="mr-5 ml-5">
                  <h2 className="tracking-tight text-gray-900 dark:text-white">
                    Computer Number: {entry.computerNumber}
                  </h2>
                  <h2 className="tracking-tight text-gray-900 dark:text-white">
                    Computer Status: {entry.computerStatus}
                  </h2>
                </div>
              </Card>
            ))}
          </div>
        </Card>
        <div className="w-full bg-blue-gray-50 py-5 text-center">
          <div className="flex flex-wrap justify-start"></div>
        </div>
      </div>
    </div>
  ) : null;
}
