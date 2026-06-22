import { useEffect, useState } from "react";

function Deployments() {
  const [deployments, setDeployments] =
    useState([]);

  useEffect(() => {
    fetch(
      "http://localhost:3000/deployments"
    )
      .then((res) => res.json())
      .then((data) =>
        setDeployments(data)
      );
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
      }}
    >
      <h1>
        Deployment History
      </h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Status</th>
            <th>Created</th>
            <th>Open</th>
          </tr>
        </thead>

        <tbody>
          {deployments.map(
            (deployment) => (
              <tr
                key={
                  deployment.id
                }
              >
                <td>
                  {deployment.id}
                </td>

                <td>
                  {
                    deployment.status
                  }
                </td>

                <td>
                  {new Date(
                    deployment.createdAt
                  ).toLocaleString()}
                </td>

                <td>
                  {deployment.deploymentUrl && (
                    <a
                      href={
                        deployment.deploymentUrl
                      }
                      target="_blank"
                    >
                      Open
                    </a>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Deployments;