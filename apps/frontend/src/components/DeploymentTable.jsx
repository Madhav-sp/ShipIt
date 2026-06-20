import StatusBadge from "./StatusBadge";

function DeploymentTable({
  deployments
}) {

  return (
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

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default DeploymentTable;