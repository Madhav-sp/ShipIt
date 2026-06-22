import { useState } from "react";
import axios from "axios";
import StatusBadge from "./StatusBadge";

function DeploymentTable({
  deployments,
}) {

  const [logs, setLogs] =
    useState("");

  const [showLogs, setShowLogs] =
    useState(false);

  const fetchLogs = async (
    projectId
  ) => {

    try {

      const res =
        await axios.get(
          `http://localhost:3000/deployment/${projectId}`,
          {
            withCredentials: true
          }
        );

      setLogs(
        res.data.logs ||
        "No logs available"
      );

      setShowLogs(true);

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <>
      <div className="bg-[#161B22] mt-6 rounded-lg border border-gray-800">

        <table className="w-full">

          <thead>
            <tr className="border-b border-gray-800">

              <th className="p-4 text-left">
                Project ID
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {deployments.map(
              (deployment) => (

                <tr
                  key={
                    deployment.projectId
                  }
                >

                  <td className="p-4">
                    {
                      deployment.projectId
                    }
                  </td>

                  <td className="p-4">
                    <StatusBadge
                      status={
                        deployment.status
                      }
                    />
                  </td>

                  <td className="p-4 flex gap-2">

                    {deployment.deploymentUrl && (
                      <a
                        href={
                          deployment.deploymentUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600 px-3 py-1 rounded"
                      >
                        Open
                      </a>
                    )}

                    <button
                      onClick={() =>
                        fetchLogs(
                          deployment.projectId
                        )
                      }
                      className="bg-blue-600 px-3 py-1 rounded"
                    >
                      Logs
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {showLogs && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#161B22] p-6 rounded-lg w-[700px]">

            <h2 className="text-xl mb-4">
              Build Logs
            </h2>

            <pre className="bg-black p-4 rounded overflow-auto max-h-[400px] whitespace-pre-wrap">
              {logs}
            </pre>

            <button
              onClick={() =>
                setShowLogs(false)
              }
              className="mt-4 bg-red-600 px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>

      )}
    </>
  );
}

export default DeploymentTable;