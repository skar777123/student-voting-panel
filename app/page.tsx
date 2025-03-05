import { Entry } from "components/Entry";
import StudentVotingPanel from "/components/student-voting-panel";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      {window.localStorage.getItem("faculty") ? (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center">
            Student Voting Panel
          </h1>
          <StudentVotingPanel />
        </>
      ) : (
        <Entry />
      )}
    </main>
  );
}
