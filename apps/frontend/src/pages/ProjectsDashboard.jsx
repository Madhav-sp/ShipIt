import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers, Rocket, CheckCircle2, XCircle, FolderGit2 } from "lucide-react";
import { fetchDeployments, fetchDeploymentStatus, deployRepo } from "../lib/api";
import { toast } from "sonner";
import StatsCard from "../components/ui/StatsCard";
import ProjectCard from "../components/ui/ProjectCard";
import DeployForm from "../components/ui/DeployForm";
import EmptyState from "../components/ui/EmptyState";
import { StatsSkeleton, CardSkeleton, DeployFormSkeleton } from "../components/ui/LoadingState";

function ProjectsDashboard() {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  // Load deployments
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDeployments();
        setDeployments(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Poll deployment status
  useEffect(() => {
    if (deployments.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updated = await Promise.all(
          deployments.map(async (deployment) => {
            try {
              const res = await fetchDeploymentStatus(deployment.id);
              return {
                ...deployment,
                status: res.status,
                deploymentUrl: res.deploymentUrl,
              };
            } catch {
              return deployment;
            }
          })
        );
        setDeployments(updated);
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [deployments]);

  const handleDeploy = async (repoUrl) => {
    setIsDeploying(true);
    try {
      const res = await deployRepo(repoUrl);
      const newDeployment = {
        id: res.projectId,
        repoUrl: repoUrl,
        status: res.status,
        createdAt: new Date().toISOString(),
      };
      setDeployments((prev) => [newDeployment, ...prev]);
      toast.success("Deployment started", {
        description: "Your repository is being built.",
      });
    } catch (err) {
      toast.error("Deployment failed", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const totalDeployments = deployments.length;
  const successCount = deployments.filter(
    (d) => d.status?.toLowerCase() === "deployed"
  ).length;
  const failedCount = deployments.filter(
    (d) => d.status?.toLowerCase() === "failed"
  ).length;
  const activeCount = deployments.filter(
    (d) =>
      d.status?.toLowerCase() === "building" ||
      d.status?.toLowerCase() === "queued"
  ).length;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-xl font-semibold text-text-primary tracking-tight">
          Projects
        </h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          Manage your deployments and production environments.
        </p>
      </motion.div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Projects"
            value={totalDeployments}
            icon={Layers}
            index={0}
          />
          <StatsCard
            label="Active"
            value={activeCount}
            icon={Rocket}
            accent="text-amber-500"
            index={1}
          />
          <StatsCard
            label="Successful"
            value={successCount}
            icon={CheckCircle2}
            accent="text-emerald-500"
            index={2}
          />
          <StatsCard
            label="Failed"
            value={failedCount}
            icon={XCircle}
            accent="text-red-500"
            index={3}
          />
        </div>
      )}

      {/* Deploy Form */}
      {isLoading ? (
        <DeployFormSkeleton />
      ) : (
        <DeployForm onDeploy={handleDeploy} isDeploying={isDeploying} />
      )}

      {/* Projects Grid */}
      <div>
        <h2 className="text-[14px] font-semibold text-text-primary mb-4">
          All Projects
        </h2>

        {isLoading ? (
          <CardSkeleton count={6} />
        ) : deployments.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No projects yet"
            description="Deploy your first GitHub repository to get started."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {deployments.map((deployment, i) => (
              <ProjectCard
                key={deployment.id}
                deployment={deployment}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsDashboard;
