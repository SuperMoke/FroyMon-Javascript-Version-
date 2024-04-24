"use client";
import React, { useEffect, useState } from "react";
import NavbarComponent from "../navbar";
import {
  Avatar,
  Button,
  Card,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  where,
  getFirestore,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useRecoilState } from "recoil";
import { ComputerLabState } from "../../atoms";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../utils/auth";

function generateRandomPin() {
  return Math.floor(100000 + Math.random() * 900000);
}

export default function Generatelobby() {
  const [students, setStudents] = useState([]);
  const [profileUrls, setProfileUrls] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    classSection: "",
    computerLab: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [pin, setPin] = useState(null);
  const router = useRouter();

  const [computerLab, setComputerLab] = useRecoilState(ComputerLabState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [isAuthorized, setIsAuthorized] = useState(false);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("name");
      const storedEmail = localStorage.getItem("email");
      const storedClassSection = localStorage.getItem("classSection");
      const storedComputerLab = localStorage.getItem("computerLab");
      setFormData({
        name: storedName || "",
        email: storedEmail || "",
        classSection: storedClassSection || "",
        computerLab: storedComputerLab || "",
      });
      setComputerLab(storedComputerLab);
      const storedFormSubmitted = localStorage.getItem("formSubmitted");
      if (storedFormSubmitted === "true") {
        setFormSubmitted(true);
      }
      const storedPin = localStorage.getItem("pin");
      setPin(storedPin);

      const unsubscribe = onSnapshot(
        query(
          collection(db, "studententries"),
          where("computerLab", "==", storedComputerLab)
        ),
        (snapshot) => {
          const studentsData = [];
          const emailList = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            studentsData.push(data);
            emailList.push(data.ccaEmail);
          });
          setStudents(studentsData);
          const userQuery = query(
            collection(db, "user"),
            where("email", "in", emailList)
          );
          getDocs(userQuery).then((userSnapshot) => {
            const profileUrlsData = {};
            userSnapshot.forEach((doc) => {
              const userData = doc.data();
              profileUrlsData[userData.email] = userData.profileUrl;
            });
            setProfileUrls(profileUrlsData);
          });
        }
      );

      return () => unsubscribe();
    }
  }, [computerLab]);

  const saveFormDataToFirestore = async () => {
    const pin = generateRandomPin();
    try {
      const docRef = await addDoc(collection(db, "lobbies"), {
        ...formData,
        pin: pin,
        computerLab: formData.computerLab,
      });
      setPin(pin);
      setFormSubmitted(true);
      if (typeof window !== "undefined") {
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.setItem("classSection", formData.classSection);
        localStorage.setItem("computerLab", formData.computerLab);
        localStorage.setItem("formSubmitted", true);
        localStorage.setItem("pin", pin);
        setComputerLab(formData.computerLab);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const endSession = () => {
    localStorage.clear();
    setFormData({
      name: "",
      email: "",
      classSection: "",
    });
    setFormSubmitted(false);
    setPin(null);
    setComputerLab("");
    router.push("/teacher");
  };

  return isAuthorized ? (
    <>
      <div className="bg-blue-gray-50 min-h-screen">
        <NavbarComponent />
        <div className="flex flex-col items-center  h-[calc(100vh-64px)] bg-blue-gray-50 pt-16">
          {!formSubmitted ? (
            <div className="flex flex-col justify-center space-y-15 items-center">
              <Card className="w-[500px] h-[500px]  p-6">
                <div className="space-y-3">
                  <h5 className="tracking-tight text-gray-900 dark:text-white">
                    Name:
                  </h5>
                  <Input
                    type="name"
                    label="Enter Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <h5 className="tracking-tight text-gray-900 dark:text-white">
                    Email:
                  </h5>
                  <Input
                    type="email"
                    label="Enter Your Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <h5 className="tracking-tight text-gray-900 dark:text-white">
                    Class Section:
                  </h5>
                  <Input
                    type="text"
                    label="Enter The Class Section"
                    name="classSection"
                    value={formData.classSection}
                    onChange={handleInputChange}
                  />
                  <h5 className="tracking-tight text-gray-900 dark:text-white">
                    Computer Lab:
                  </h5>
                  <Select
                    label="Select Computer Laboratory"
                    value={formData.computerLab}
                    onChange={(value) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        computerLab: value,
                      }))
                    }
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
                </div>
                <Button className="mt-10" onClick={saveFormDataToFirestore}>
                  Submit
                </Button>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col justify-center space-y-15 items-center">
              <Card className="w-96 text-center p-4">
                <h5 className="tracking-tight text-gray-900 dark:text-white">
                  Code Generated:
                </h5>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {pin}
                </h5>
                <h5 className="tracking-tight text-gray-900 dark:text-white">
                  Computer Laboratory:
                </h5>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {computerLab}
                </h5>
                <Button onClick={endSession}>End Session</Button>
              </Card>

              <h5 className=" text-2xl mt-5 mb-5 font-bold tracking-tight text-gray-900 dark:text-white">
                Student List
              </h5>
              <Card className="w-[1000px] h-[400px] text-center flex items-start justify-start p-4">
                <div className="flex flex-wrap justify-start">
                  {students.map((student, index) => (
                    <Card
                      key={index}
                      className="text-center flex items-center mb-4 mr-4"
                    >
                      {profileUrls[student.ccaEmail] ? (
                        <Image
                          src={profileUrls[student.ccaEmail]}
                          width={50}
                          height={50}
                        />
                      ) : (
                        <Image src="/Avatar.jpg" width={50} height={50} />
                      )}
                      <div className="mr-5 ml-5">
                        <h2 className="tracking-tight text-gray-900 dark:text-white">
                          Name: {student.studentName}
                        </h2>
                        <h2 className="tracking-tight text-gray-900 dark:text-white">
                          Computer Number: {student.computerNumber}
                        </h2>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  ) : null;
}
