import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Layers,
  Rocket,
  CheckCircle2,
  XCircle,
  FolderGit2,
  Search,
  X,
  Loader2,
  TrendingUp,
} from "lucide-react";
import {
  fetchDeployments,
  fetchDeploymentStatus,
  fetchDeployment,
  deployRepo,
  deleteDeployment,
} from "../lib/api";
import { toast } from "sonner";
import StatsCard from "../components/ui/StatsCard";
import DeploymentCard from "../components/ui/DeploymentCard";
import DeployForm from "../components/ui/DeployForm";
import EmptyState from "../components/ui/EmptyState";
import {
  StatsSkeleton,
  CardSkeleton,
  DeployFormSkeleton,
} from "../components/ui/LoadingState";
import LogsModal from "../components/ui/LogsModal";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";
import { extractRepoShortName } from "../lib/utils";

function ProjectsDashboard() {
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Logs modal state
  const [selectedLogsDeployment, setSelectedLogsDeployment] = useState(null);
  const [logsText, setLogsText] = useState("");
  const [isLogsLoading, setIsLogsLoading] = useState(false);

  // Delete modal state
  const [deploymentToDelete, setDeploymentToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const deployInputRef = useRef(null);

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

  // Poll deployment status only for active builds
  useEffect(() => {
    const activeDeployments = deployments.filter(
      (d) => d.status === "QUEUED" || d.status === "BUILDING"
    );
    if (activeDeployments.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const results = await Promise.all(
          activeDeployments.map(async (deployment) => {
            try {
              const res = await fetchDeploymentStatus(deployment.id);
              return { id: deployment.id, status: res.status, deploymentUrl: res.deploymentUrl };
            } catch (err) {
              if (err.response?.status === 404) {
                return { id: deployment.id, notFound: true };
              }
              return null;
            }
          })
        );

        const statusUpdates = new Map();
        for (const r of results) {
          if (r) statusUpdates.set(r.id, r);
        }

        setDeployments((prev) =>
          prev
            .map((d) => {
              const update = statusUpdates.get(d.id);
              if (update?.notFound) return null;
              if (update && !update.notFound) {
                return { ...d, status: update.status, deploymentUrl: update.deploymentUrl };
              }
              return d;
            })
            .filter(Boolean)
        );
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [deployments]);

  // Poll logs if logs modal is open
  useEffect(() => {
    if (!selectedLogsDeployment) return;

    const fetchCurrentLogs = async () => {
      try {
        const data = await fetchDeployment(selectedLogsDeployment.id);
        setLogsText(data.logs || "No logs available yet.");
      } catch {
        setLogsText("Error loading logs.");
      } finally {
        setIsLogsLoading(false);
      }
    };

    setIsLogsLoading(true);
    fetchCurrentLogs();

    const interval = setInterval(fetchCurrentLogs, 3000);
    return () => clearInterval(interval);
  }, [selectedLogsDeployment]);

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

  const handleRedeploy = async (deployment) => {
    setIsDeploying(true);
    try {
      const res = await deployRepo(deployment.repoUrl);
      const newDeployment = {
        id: res.projectId,
        repoUrl: deployment.repoUrl,
        status: res.status,
        createdAt: new Date().toISOString(),
      };
      setDeployments((prev) => [newDeployment, ...prev]);
      toast.success("Redeployment started", {
        description: "Your repository is being rebuilt.",
      });
    } catch (err) {
      toast.error("Redeployment failed", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deploymentToDelete) return;
    const targetId = deploymentToDelete.id;
    setDeletingId(targetId);

    try {
      await deleteDeployment(targetId);
      // Remove it from the dashboard immediately without refreshing
      setDeployments((prev) => prev.filter((d) => d.id !== targetId));
      setDeploymentToDelete(null);
      toast.success("Deployment deleted successfully.");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 404) {
        setDeployments((prev) => prev.filter((d) => d.id !== targetId));
        setDeploymentToDelete(null);
        toast.success("Deployment deleted successfully.");
      } else if (status === 403) {
        toast.error("Forbidden: You do not own this deployment (403)");
      } else if (status === 500) {
        toast.error("Server error while deleting deployment (500)");
      } else {
        toast.error(msg || "Failed to delete deployment.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Instant search filtering by Project Name, Repository URL, Status
  const filteredDeployments = deployments.filter((d) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const projectName = extractRepoShortName(d.repoUrl).toLowerCase();
    const repoUrl = (d.repoUrl || "").toLowerCase();
    const status = (d.status || "").toLowerCase();
    return (
      projectName.includes(query) ||
      repoUrl.includes(query) ||
      status.includes(query)
    );
  });

  const totalDeployments = deployments.length;
  const successCount = deployments.filter(
    (d) =>
      d.status?.toLowerCase() === "deployed" ||
      d.status?.toLowerCase() === "ready"
  ).length;
  const failedCount = deployments.filter(
    (d) =>
      d.status?.toLowerCase() === "failed" ||
      d.status?.toLowerCase() === "error"
  ).length;
  const successRate =
    totalDeployments > 0
      ? Math.round((successCount / totalDeployments) * 100) + "%"
      : "0%";

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
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
            label="Deployments"
            value={totalDeployments}
            icon={Layers}
            index={0}
          />
          <StatsCard
            label="Successful"
            value={successCount}
            icon={CheckCircle2}
            accent="text-emerald-500"
            index={1}
          />
          <StatsCard
            label="Failed"
            value={failedCount}
            icon={XCircle}
            accent="text-red-500"
            index={2}
          />
          <StatsCard
            label="Success Rate"
            value={successRate}
            icon={TrendingUp}
            accent="text-blue-400"
            index={3}
          />
        </div>
      )}

      {/* Deploy Form */}
      {isLoading ? (
        <DeployFormSkeleton />
      ) : (
        <div ref={deployInputRef}>
          <DeployForm onDeploy={handleDeploy} isDeploying={isDeploying} />
        </div>
      )}

      {/* Projects Grid Section with Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-[15px] font-semibold text-text-primary">
            All Projects
          </h2>

          {/* Search bar above deployments */}
          <div className="relative w-full sm:w-[320px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, repository, or status..."
              className="w-full bg-card border border-border rounded-lg pl-9 pr-8 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-muted hover:text-text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[13px] text-text-muted">
              <Loader2 size={16} className="animate-spin" />
              <span>Loading deployments...</span>
            </div>
            <CardSkeleton count={6} />
          </div>
        ) : deployments.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No deployments yet"
            description="Deploy your first GitHub repository to get started."
            action={
              <button
                onClick={() => {
                  deployInputRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  const input =
                    deployInputRef.current?.querySelector("input");
                  if (input) input.focus();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-background text-[13px] font-semibold hover:bg-accent-hover transition-colors"
              >
                <Rocket size={14} />
                Deploy Repository
              </button>
            }
          />
        ) : filteredDeployments.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-xl">
            <p className="text-[14px] font-medium text-text-primary">
              No matching deployments found
            </p>
            <p className="text-[13px] text-text-muted mt-1">
              Try searching for another project name, repository URL, or status.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-1.5 rounded-md bg-surface border border-border text-[12px] text-text-secondary hover:text-text-primary transition-colors"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredDeployments.map((deployment, i) => (
              <DeploymentCard
                key={deployment.id}
                deployment={deployment}
                index={i}
                onViewLogs={(dep) => setSelectedLogsDeployment(dep)}
                onRedeploy={handleRedeploy}
                onDelete={(dep) => setDeploymentToDelete(dep)}
                isDeleting={deletingId === deployment.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Logs Modal */}
      <LogsModal
        open={Boolean(selectedLogsDeployment)}
        onOpenChange={(open) => {
          if (!open) setSelectedLogsDeployment(null);
        }}
        logs={logsText}
        isLoading={isLogsLoading}
        title={
          selectedLogsDeployment
            ? `Logs — ${extractRepoShortName(selectedLogsDeployment.repoUrl)}`
            : "Build Logs"
        }
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={Boolean(deploymentToDelete)}
        onOpenChange={(open) => {
          if (!open && !deletingId) setDeploymentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={Boolean(deletingId)}
      />
    </div>
  );
}

export default ProjectsDashboard;
