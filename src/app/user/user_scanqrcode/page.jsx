"use client";
import React, { useState } from "react";
import NavbarComponent from "../navbar";
import {
  Card,
  Button,
  Input,
  Stepper,
  Step,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import Html5QrcodePlugin from "../../Html5QrcodeScanner";
import { faQrcode, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

export default function QrScannerPage() {
  const [data, setData] = useState("No result");
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentID: "",
    ccaEmail: "",
    computerStatus: "",
  });

  const handleRead = (decodedText, decodedResult) => {
    setData(decodedText);
    setActiveStep(1);
  };

  const handleSubmit = async () => {
    try {
      const currentTime = new Date();
      let hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      await addDoc(collection(db, "studententries"), {
        studentName: formData.studentName,
        studentID: formData.studentID,
        ccaEmail: formData.ccaEmail,
        computerStatus: formData.computerStatus,
        computerNumber: data.split(" ")[0],
        computerLab: data.split(" ")[1],
        timeIn: formattedTime,
      });
      setActiveStep(2);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEndSession = async () => {
    try {
      const currentTime = new Date();
      let hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;
      await addDoc(collection(db, "studententries"), {
        ...formData,
        timeOut: formattedTime,
      });
      router.push("/user");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <div className="bg-blue-gray-50 min-h-screen">
        <NavbarComponent />
        <div className="flex flex-col items-center mt-10 h-[calc(100vh-64px)] bg-blue-gray-50 pt-16">
          <div className="w-full px-14 sm:px-20 py-4">
            <Stepper
              activeStep={activeStep}
              isLastStep={(value) => setIsLastStep(value)}
              isFirstStep={(value) => setIsFirstStep(value)}
            >
              <Step>1</Step>
              <Step>2</Step>
              <Step>3</Step>
            </Stepper>
            <div className="flex justify-center items-center mt-19">
              {activeStep === 0 && (
                <div>
                  <Typography className="text-center mt-5" variant="h6">
                    Scan The QR Code
                  </Typography>
                  <Card className="w-full max-w-sm flex justify-center p-5 mt-5">
                    <Html5QrcodePlugin
                      fps={10}
                      qrbox={250}
                      disableFlip={false}
                      qrCodeSuccessCallback={handleRead}
                    />
                  </Card>
                </div>
              )}
              {activeStep === 1 && (
                <div className="w-full">
                  <Typography className="text-center mt-5" variant="h6">
                    Fill out the details
                  </Typography>
                  <Card className="w-full p-5">
                    <h2 className="text-black text-sm font-normal mb-2">
                      Student Name:
                    </h2>
                    <Input
                      className="mb-3"
                      label="Enter the Student Name"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentName: e.target.value,
                        })
                      }
                    ></Input>
                    <h2 className="text-black text-sm font-normal mt-2 mb-2">
                      Student ID:
                    </h2>
                    <Input
                      className="mb-3"
                      label="Enter the Student ID"
                      onChange={(e) =>
                        setFormData({ ...formData, studentID: e.target.value })
                      }
                    ></Input>
                    <h2 className="text-black text-sm font-normal mt-2 mb-2">
                      CCA Email:
                    </h2>
                    <Input
                      className="mb-3"
                      label="Enter the CCA Email"
                      onChange={(e) =>
                        setFormData({ ...formData, ccaEmail: e.target.value })
                      }
                    ></Input>
                    <h2 className="text-black text-sm font-normal mt-2 mb-2">
                      Computer Status:
                    </h2>
                    <Select
                      label="Select Computer Status"
                      placeholder={undefined}
                      onChange={(value) =>
                        setFormData({ ...formData, computerStatus: value })
                      }
                    >
                      <Option value="Hardware Issues">Hardware Issues</Option>
                      <Option value="Software Issues">Software Issues</Option>
                      <Option value="Network Problems">Network Problems</Option>
                      <Option value="Computer is Full Functional">
                        Computer is Full Functional
                      </Option>
                    </Select>
                    <Button className="mt-3" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Card>
                </div>
              )}

              {activeStep === 2 && (
                <div className="w-full">
                  <Typography className="text-center mt-5" variant="h6">
                    Wait for the class session to end
                  </Typography>
                  <Card className="w-full p-5 flex flex-col items-center">
                    <Image
                      src="/thankyou.jpeg"
                      width={200}
                      height={200}
                      alt="Thank You Picture"
                      className="mx-auto"
                    />
                    <h1 className="text-black text-sm font-normal text-center mt-2 mb-2">
                      Thank you for submitting the form!
                    </h1>
                    <h2 className="text-black text-sm font-normal text-center mt-2 mb-2">
                      I recommend that you stay on this page until your class
                      session has ended so that your time out will be recorded.
                    </h2>
                    <Button className="mt-3" onClick={handleEndSession}>
                      End of Session
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
