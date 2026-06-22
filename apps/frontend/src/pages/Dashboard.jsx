import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import DeployForm from "../components/DeployForm";
import DeploymentTable from "../components/DeploymentTable";

function Dashboard() {
  const [deployments, setDeployments] =
    useState([]);

  // Load deployments from PostgreSQL
  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/deployments"
        );

        const formatted =
          res.data.map(
            (deployment) => ({
              projectId:
                deployment.id,
              repoUrl:
                deployment.repoUrl,
              status:
                deployment.status,
              deploymentUrl:
                deployment.deploymentUrl,
              createdAt:
                deployment.createdAt,
            })
          );

        setDeployments(
          formatted
        );

      } catch (err) {
        console.error(err);
      }
    };

    fetchDeployments();
  }, []);

  // Poll deployment status
  useEffect(() => {

    const interval =
      setInterval(
        async () => {

          try {

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
                      deploymentUrl:
                        res.data.deploymentUrl,
                    };
                  }
                )
              );

            setDeployments(
              updated
            );

          } catch (err) {
            console.error(
              err
            );
          }

        },

        2000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [deployments]);

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10">

        <DeployForm
          deployments={
            deployments
          }
          setDeployments={
            setDeployments
          }
        />

        <DeploymentTable
          deployments={
            deployments
          }
           setDeployments={setDeployments}

        />

      </div>
    </>
  );
}

export default Dashboard;