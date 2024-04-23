"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { QRCode } from "react-qr-code";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../utils/auth";

export default function Admin_GenerateQR() {
  const [computerNumber, setComputerNumber] = useState("");
  const [computerLab, setComputerLab] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");

  const qrCodeRef = useRef(null);

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
      const computerNumberValue = computerNumber;
      const computerLabValue = computerLab;
      const combinedValue = `${computerNumberValue} ${computerLabValue}`;
      setQrCodeValue(combinedValue);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleSaveAsImage = () => {
    // Capture the QR code as an image using html2canvas
    html2canvas(qrCodeRef.current).then((canvas) => {
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL("image/png");
      // Create a link element
      const link = document.createElement("a");
      // Set the href attribute to the data URL
      link.href = dataUrl;
      // Set the download attribute to provide a filename
      link.download = "qr_code.png";
      // Simulate a click on the link to trigger the download
      link.click();
    });
  };

  return isAuthorized ? (
    <>
      <div className="bg-blue-gray-50 min-h-screen">
        <NavbarComponent />
        <div className="flex flex-col items-center h-[calc(100vh-64px)] bg-blue-gray-50 pt-10">
          <Typography variant="h2" className="mb-4 text-center">
            Admin Generate QR
          </Typography>
          <Card className="w-96 p-8">
            {qrCodeValue && (
              <div className="flex justify-center" ref={qrCodeRef}>
                <QRCode
                  value={qrCodeValue}
                  size={256}
                  viewBox={`0 0 256 256`}
                />
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <Typography color="gray" className="font-normal mt-2 mb-2">
                Computer Number
              </Typography>
              <Input
                type="text"
                label="Enter The Computer Number"
                onChange={(e) => setComputerNumber(e.target.value)}
                value={computerNumber}
                required
              ></Input>
              <Typography className="font-normal mb-2">
                Computer Laboratory:
              </Typography>
              <Select
                label="Select Computer Laboratory"
                onChange={(value) => setComputerLab(value)}
                value={computerLab}
              >
                <Option value="CLAB1">Computer Laboratory 1</Option>
                <Option value="CLAB2">Computer Laboratory 2</Option>
                <Option value="CLAB3">Computer Laboratory 3</Option>
                <Option value="CLAB4">Computer Laboratory 4</Option>
                <Option value="CLAB5">Computer Laboratory 5</Option>
                <Option value="CLAB6">Computer Laboratory 6</Option>
                <Option value="CiscoLab">Cisco Laboratory</Option>
                <Option value="AccountingLab">Accounting Laboratory</Option>
                <Option value="HardwareLab">Hardware Laboratory</Option>
                <Option value="ContactCenterLab">
                  Contact Center Laboratory
                </Option>
              </Select>
              <Button onClick={handleFormSubmit}>Generate</Button>
              {qrCodeValue && (
                <Button onClick={handleSaveAsImage}>Save as Image</Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  ) : null;
}
