"use client";
import React, { useState, useEffect } from "react";
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
  Alert,
} from "@material-tailwind/react";
import { faQrcode, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Html5Qrcode } from "html5-qrcode";
import { isAuthenticated } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function QrScannerPage() {
  const [data, setData] = useState("No result");
  const [result, setResult] = useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentID: "",
    ccaEmail: "",
    computerStatus: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await isAuthenticated("student");
      setIsAuthorized(authorized);
      if (!authorized) {
        router.push("/");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    let html5QrCode;
    if (scanning) {
      const qrCodeSuccessCallback = async (decodedText) => {
        setData(decodedText);
        const computerNumber = decodedText.split(" ")[0];
        const computerLab = decodedText.split(" ")[1];
        try {
          const q = query(
            collection(db, "lobbies"),
            where("computerLab", "==", computerLab)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setActiveStep(1);
          } else {
            setErrorMessage("Computer Lab not found");
          }
        } catch (error) {
          console.error("Error querying Firestore: ", error);
          setErrorMessage("An error occurred while processing your request");
        }
        setScanning(false);
      };

      html5QrCode = new Html5Qrcode("qr-code-reader");
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 150 },
        qrCodeSuccessCallback
      );
    }

    return () => {
      if (html5QrCode) {
        html5QrCode
          .stop()
          .then((ignore) => {})
          .catch((err) => console.error(err));
      }
    };
  }, [scanning]);

  const startScan = () => {
    setResult("");
    setScanning(true);
  };

  const stopScan = () => {
    setScanning(false);
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
      const endsessionquery = query(
        collection(db, "studententries"),
        where("ccaEmail", "==", formData.ccaEmail)
      );
      const querySnapshot = await getDocs(endsessionquery);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          timeOut: formattedTime,
        });
      }
      router.push("/user");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return isAuthorized ? (
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
            <div className="flex  justify-center items-center mt-19">
              {activeStep === 0 && (
                <div style={{ width: "100%" }}>
                  <div className="mb-5"></div>
                  {errorMessage && (
                    <Alert variant="outlined" color="red">
                      <span className="text-center">{errorMessage}</span>
                    </Alert>
                  )}
                  <Typography className="text-center mt-5" variant="h6">
                    Scan The QR Code
                  </Typography>
                  <div className="flex justify-center items-center h-[calc(100vh-260px)]">
                    <Card
                      style={{ width: "100%" }}
                      className="sm:max-w-md md:max-w-lg  lg:max-w-xl xl:max-w-2xl p-6 mt-4"
                    >
                      {scanning ? (
                        <>
                          <div
                            style={{ width: "100%", height: "100%" }}
                            id="qr-code-reader"
                          ></div>
                          <Button
                            onClick={stopScan}
                            className="mt-4"
                            style={{ width: "100%" }}
                          >
                            Stop Scanning
                          </Button>
                        </>
                      ) : (
                        <Button onClick={startScan} style={{ width: "100%" }}>
                          Start Scanning
                        </Button>
                      )}
                    </Card>
                  </div>
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
                      <Option value="Computer is Working">
                        Computer is Fully Functional
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
  ) : null;
}
