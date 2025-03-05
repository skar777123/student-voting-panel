"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BarLoader } from "react-spinners";
// Define the student type

export default function StudentVotingPanel() {
  const [loader, setLoader] = useState(true);
  const [students, setStudents] = useState<
    {
      id: number;
      name: string;
      photo: string;
      description: string[];
      class: string;
    }[]
  >([]);
  const [vote, setVote] = useState<number>(0);

  async function Fetch() {
    await fetch("https://sotybackend.onrender.com/students/soty", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.data);
        // console.log(data.data);
        setLoader(false);
      });
  }
  useEffect(() => {
    Fetch();
  }, []);
  // State to track votes for each student
  const [votes, setVotes] = useState<{ [key: number]: number }>(
    students.reduce((acc, student) => {
      acc[student.id] = 5; // Default value of 5
      return acc;
    }, {} as { [key: number]: number })
  );

  // Handle vote change
  const handleVoteChange = (studentId: number, value: number[]) => {
    setVote(value[0]); // Update the vote state for the slider
    setVote(value[0]); // Update the vote state for the slider
    setVotes({
      ...votes,
      [studentId]: value[0],
    });
  };

  // Handle vote submission
  const handleSubmitVote = (studentId: number) => {
    // Here you would typically send the vote to a server
    alert(
      `Vote of ${votes[studentId]}/10 submitted for ${
        students.find((s) => s.id === studentId)?.name
      }`
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loader && (
        <div className="flex flex-col justify-center items-center">
          <BarLoader />
          <p className="p-2 text-center font-bold">Loading...</p>
        </div>
      )}
      {!loader &&
        students.map((student) => (
          <Card key={student.id} className="overflow-hidden">
            <CardHeader className="p-0">
              {
                student.photo && <div className="relative h-80 w-full">
                <Image
                  src={student.photo || "/next.svg"}
                  alt={`Photo of ${student.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              }
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold ">{student.name}</h2>
              <h2 className="text-lg font-bold mb-3">{student.class}</h2>
              <div className="mb-4">
                {student.description.map((item, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="mr-2 mb-2 text-sm px-3 py-1"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex flex-col justify-between mb-2">
                  <span className="text-sm text-muted-foreground font-bold">
                    Rate :
                  </span>
                  <div>
                    <button
                      className="p-4"
                      onClick={() => {
                        setVote(vote - 1);
                      }}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      max={10}
                      min={1}
                      value={vote}
                      onChange={(e) => {
                        setVote(Number(e.target.value));
                      }} // Update the vote state for the student
                      className="my-4 bg-black text-white text-center w-10 rounded-lg"
                    />
                    <button
                      className="p-4"
                      onClick={() => {
                        setVote(vote + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {window.localStorage.getItem(`${student.name}`) ? (
                  <Button>Voted</Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      await fetch(
                        "https://sotybackend.onrender.com/students/vote",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: student.name,
                            vote: vote,
                            voter: window.localStorage.getItem("faculty"),
                          }),
                        }
                      ).then(() => {
                        window.localStorage.setItem(
                          `${student.name}`,
                          student.name
                        );
                        window.location.reload();
                      });
                    }}
                  >
                    Submit Vote
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
