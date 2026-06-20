import { useState } from "react";
import Navbar from "../components/Navbar";
import DeployForm from "../components/DeployForm";
import DeploymentTable from "../components/DeploymentTable";
import { useEffect } from "react";
import axios from "axios";
function Dashboard() {

  const [deployments, setDeployments] =
    useState([]);
    useEffect(() => {

  const interval =
    setInterval(async () => {

      const updated =
        await Promise.all(

          deployments.map(
            async (
              deployment
            ) => {

              const res =
                await axios.get(
                  `http://localhost:3000/status/${deployment.projectId}`
                );

              return {
                ...deployment,
                status:
                  res.data.status,
              };
            }
          )
        );

      setDeployments(updated);

    }, 2000);

  return () =>
    clearInterval(interval);

}, [deployments]);

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10">

        <DeployForm
          deployments={deployments}
          setDeployments={setDeployments}
        />

        <DeploymentTable
          deployments={deployments}
        />

      </div>
    </>
  );
}

export default Dashboard;