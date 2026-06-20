import { useState } from "react";
import axios from "axios";

function DeployForm({
  deployments,
  setDeployments,
}) {

  const [repoUrl, setRepoUrl] =
    useState("");

  const deploy = async () => {

    try {

      const res =
        await axios.post(
          "http://localhost:3000/deploy",
          {
            repoUrl,
          }
        );

      const deployment = {
        projectId:
          res.data.projectId,

        status:
          res.data.status,
      };

      setDeployments([
        deployment,
        ...deployments,
      ]);

      setRepoUrl("");

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div className="bg-[#161B22] p-6 rounded-lg border border-gray-800">

      <h2 className="text-lg font-semibold mb-4">
        Deploy Repository
      </h2>

      <input
        value={repoUrl}
        onChange={(e) =>
          setRepoUrl(e.target.value)
        }
        placeholder="GitHub Repository URL"
        className="w-full p-3 rounded bg-[#0D1117] border border-gray-700"
      />

      <button
        onClick={deploy}
        className="mt-4 px-5 py-2 bg-green-600 rounded"
      >
        Deploy
      </button>

    </div>
  );
}

export default DeployForm;