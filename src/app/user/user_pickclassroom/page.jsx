"use client";
import React from "react";
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
import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../utils/auth";

export default function PickClassroom() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [pinCode, setPinCode] = useState("");
  const [pinCodeError, setPinCodeError] = useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentID: "",
    ccaEmail: "",
    computerLab: "",
    computerNumber: "",
    computerStatus: "",
  });
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
    let unsubscribe = listenForClassroomUpdates();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const listenForClassroomUpdates = () => {
    const unsubscribe = onSnapshot(
      collection(db, "lobbies"),
      (querySnapshot) => {
        const classroomData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          classroomData.push(data);
        });
        setClassrooms(classroomData);
      }
    );

    return unsubscribe;
  };

  const handleCardClick = (computerLab) => {
    setSelectedLab(computerLab);
    setActiveStep(1);
  };

  const handleSubmitPinCode = async () => {
    try {
      const pinCodeQuery = query(
        collection(db, "lobbies"),
        where("computerLab", "==", selectedLab)
      );
      const querySnapshot = await getDocs(pinCodeQuery);
      if (!querySnapshot.empty) {
        const lobbyData = querySnapshot.docs[0].data();
        const correctPinCode = lobbyData.pin;
        if (pinCode == correctPinCode) {
          setActiveStep(2);
        } else {
          setPinCodeError("Incorrect pin code. Please try again.");
        }
      } else {
        setPinCodeError("Pin code data not found for this computer lab.");
      }
    } catch (error) {
      console.error("Error retrieving pin code: ", error);
      setPinCodeError("Error retrieving pin code. Please try again later.");
    }
  };

  const handleFormDataChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const formatTime = (hours, minutes) => {
    const ampm = hours >= 12 ? "PM" : "AM";
    let formattedHours = hours % 12;
    formattedHours = formattedHours ? formattedHours : 12; // Handle 0 as 12 AM
    const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure minutes have leading zero if needed
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleSubmit = async () => {
    try {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const formattedTime = formatTime(hours, minutes);

      await addDoc(collection(db, "studententries"), {
        ...formData,
        timeIn: formattedTime,
      });
      setActiveStep(3);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEndSession = async () => {
    try {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const formattedTime = formatTime(hours, minutes);

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
              <Step>4</Step>
            </Stepper>
            <div className="flex justify-center items-center mt-20">
              {activeStep === 0 && (
                <Card className="w-full p-5">
                  <h2 className="text-2xl text-center font-bold mb-4">
                    Pick a Classroom
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {classrooms.length > 0 ? (
                      classrooms.map((classroom, index) => (
                        <Card
                          key={index}
                          className="p-4 cursor-pointer hover:shadow-lg transition duration-300"
                          onClick={() => handleCardClick(classroom.computerLab)}
                        >
                          <h3 className="font-semibold mb-2">
                            Teacher: {classroom.name}
                          </h3>
                          <p className="font-semibold mb-2">
                            Computer Lab: {classroom.computerLab}
                          </p>
                        </Card>
                      ))
                    ) : (
                      <div className="flex justify-center items-center col-span-full">
                        <p className="text-gray-600">
                          There are no lobbies available.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {activeStep === 1 && (
                <div className="w-full">
                  <Typography className="text-center mt-5" variant="h6">
                    Lobby Code
                  </Typography>
                  <Card className="w-full p-5">
                    <h2 className="text-black text-sm font-normal mb-2">
                      Lobby Code:
                    </h2>
                    <Input
                      className="mb-3"
                      label="Enter the Pin Code"
                      type="password"
                      onChange={(e) => setPinCode(e.target.value)}
                      error={pinCodeError}
                    ></Input>
                    <Button className="mt-3" onClick={handleSubmitPinCode}>
                      Submit
                    </Button>
                  </Card>
                </div>
              )}

              {activeStep === 2 && (
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
                      Computer Laboratory:
                    </h2>
                    <Select
                      label="Select Computer Laboratory"
                      placeholder={undefined}
                      onChange={(value) =>
                        setFormData({ ...formData, computerLab: value })
                      }
                    >
                      <Option value="CLAB1">Computer Laboratory 1</Option>
                      <Option value="CLAB2">Computer Laboratory 2</Option>
                      <Option value="CLAB3">Computer Laboratory 3</Option>
                      <Option value="CLAB4">Computer Laboratory 4</Option>
                      <Option value="CLAB5">Computer Laboratory 5</Option>
                      <Option value="CLAB6">Computer Laboratory 6</Option>
                      <Option value="CiscoLab">Cisco Laboratory</Option>
                      <Option value="AccountingLab">
                        Accounting Laboratory
                      </Option>
                      <Option value="HardwareLab">Hardware Laboratory</Option>
                      <Option value="ContactCenterLab">
                        Contact Center Laboratory
                      </Option>
                    </Select>
                    <h2 className="text-black text-sm font-normal mt-2 mb-2">
                      Computer Number:
                    </h2>
                    <Input
                      className="mb-3"
                      label="Enter the Computer Number"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          computerNumber: e.target.value,
                        })
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
                        Computer is Fully Functional
                      </Option>
                    </Select>
                    <Button className="mt-3" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Card>
                </div>
              )}

              {activeStep === 3 && (
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
