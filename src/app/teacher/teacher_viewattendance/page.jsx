"use client";
import React, { useEffect, useState } from "react";
import NavbarComponent from "../navbar";
import { Card, Typography } from "@material-tailwind/react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useRecoilValue } from "recoil";
import { ComputerLabState } from "../../atoms";

export default function ViewAttendance() {
  const TABLE_HEAD = ["Student Name", "Email", "Class Section", "Computer Lab"];
  const [students, setStudents] = useState([]);
  const computerLab = useRecoilValue(ComputerLabState);

  useEffect(() => {
    const q = query(
      collection(db, "studententries"),
      where("labid", "==", computerLab)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentsData = [];
      querySnapshot.forEach((doc) => {
        const studentData = doc.data();
        studentsData.push(studentData);
      });
      setStudents(studentsData);
    });
    return () => unsubscribe();
  }, [computerLab]);

  return (
    <>
      <div className="bg-blue-gray-50 min-h-screen">
        <NavbarComponent />
        <div className="flex flex-col items-center h-[calc(100vh-64px)] bg-blue-gray-50 pt-16">
          <h5 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
            View Attendance Form
          </h5>
          <p>{computerLab}</p>
          <Card className="w-[1000px] h-[400px] overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {student.name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {student.email}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {student.section}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {student.labid}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </>
  );
}
