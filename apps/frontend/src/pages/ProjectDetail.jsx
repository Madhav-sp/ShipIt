import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  RotateCw,
  Terminal,
  Copy,
  Download,
  Check,
  Link as LinkIcon,
  Loader2,
  Clock,
  Trash2,
} from "lucide-react";
import { fetchDeployments, fetchDeployment, fetchDeploymentStatus, deployRepo, deleteDeployment } from "../lib/api";
import { extractRepoName, extractRepoShortName, formatRelativeTime, getStatusColor } from "../lib/utils";
import { toast } from "sonner";
import StatusBadge from "../components/ui/StatusBadge";
import { DetailSkeleton } from "../components/ui/LoadingState";
import DeleteConfirmModal from "../components/ui/DeleteConfirmModal";

function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [logs, setLogs] = useState("");
  const [isLogsLoading, setIsLogsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const logsRef = useRef(null);

  // Fetch project details
  useEffect(() => {
    const load = async () => {
      try {
        const deployments = await fetchDeployments();
        const found = deployments.find((d) => d.id === id);
        if (found) {
          setProject(found);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  // Fetch logs and poll status
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await fetchDeployment(id);
        setLogs(data.logs || "No logs available yet.");
      } catch {
        setLogs("Error loading logs.");
      } finally {
        setIsLogsLoading(false);
      }
    };

    fetchLogs();

    if (project?.status === "SUCCESS" || project?.status === "FAILED") return;

    const interval = setInterval(async () => {
      try {
        const logData = await fetchDeployment(id);
        setLogs(logData.logs || "No logs available yet.");

        const statusData = await fetchDeploymentStatus(id);
        setProject((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            status: statusData.status,
            deploymentUrl: statusData.deploymentUrl,
          };
        });
      } catch (err) {
        // Don't override existing logs on network blips
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id, project?.status]);

  // Auto-scroll logs
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const handleRedeploy = async () => {
    if (!project || !project.repoUrl) return;
    setIsDeploying(true);
    try {
      const res = await deployRepo(project.repoUrl);
      toast.success("Redeployment started");
      navigate(`/projects/${res.projectId}`);
    } catch (err) {
      toast.error("Redeployment failed", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!project) return;
    setIsDeleting(true);
    try {
      await deleteDeployment(project.id);
      toast.success("Deployment deleted successfully.");
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (status === 404) {
        toast.success("Deployment deleted successfully.");
        navigate("/dashboard");
      } else if (status === 403) {
        toast.error("Forbidden: You do not own this deployment (403)");
      } else if (status === 500) {
        toast.error("Server error while deleting deployment (500)");
      } else {
        toast.error(msg || "Failed to delete deployment.");
      }
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleCopyUrl = () => {
    if (!project.deploymentUrl) return;
    navigator.clipboard.writeText(project.deploymentUrl);
    setUrlCopied(true);
    toast.success("Copied to clipboard.");
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const handleCopyLogs = async () => {
    if (!logs) return;
    try {
      await navigator.clipboard.writeText(logs);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadLogs = () => {
    if (!logs) return;
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `build-logs-${id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!project) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto">
        <DetailSkeleton />
      </div>
    );
  }

  const repoName = extractRepoShortName(project.repoUrl);
  const repoFullName = extractRepoName(project.repoUrl);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Back button + Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
              <GitBranch size={18} className="text-text-muted" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-semibold text-text-primary tracking-tight">
                  {repoName}
                </h1>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-[12px] text-text-muted mt-0.5">
                {repoFullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-card hover:border-border-hover transition-colors"
            >
              <GitBranch size={13} />
              Repository
            </a>
            {project.deploymentUrl && (
              <a
                href={project.deploymentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-card hover:border-border-hover transition-colors"
              >
                <ExternalLink size={13} />
                Visit
              </a>
            )}
            <button
              onClick={handleRedeploy}
              disabled={isDeploying}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-background text-[12px] font-semibold hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isDeploying ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RotateCw size={13} />
              )}
              {isDeploying ? "Deploying..." : "Redeploy"}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-[12px] font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Deployment Info + Logs */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Deployment Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">
                Current Deployment
              </span>
              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <Clock size={11} />
                {formatRelativeTime(project.createdAt)}
              </span>
            </div>
            <div className="p-4 space-y-3">
              {/* Deployment URL */}
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Deployment URL
                </p>
                {project.deploymentUrl ? (
                  <div className="flex items-center justify-between gap-2 bg-background px-3 py-2 rounded-lg border border-border">
                    <a
                      href={project.deploymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] text-text-primary hover:underline font-mono truncate min-w-0"
                    >
                      <LinkIcon size={12} className="text-text-muted shrink-0" />
                      <span className="truncate">{project.deploymentUrl.replace(/^https?:\/\//, "")}</span>
                    </a>
                    <button
                      onClick={handleCopyUrl}
                      title="Copy Deployment URL"
                      className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors shrink-0 flex items-center justify-center"
                    >
                      {urlCopied ? (
                        <Check size={13} className="text-emerald-500" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-[13px] text-text-muted">
                    Not available yet
                  </p>
                )}
              </div>

              {/* Repository */}
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Source
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background border border-border">
                  <GitBranch size={12} className="text-text-muted" />
                  <code className="text-[12px] text-text-secondary font-mono">
                    {repoFullName}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Build Logs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="bg-[#09090B] border border-border rounded-xl overflow-hidden flex flex-col"
            style={{ height: "480px" }}
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0 bg-surface">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-text-muted" />
                <span className="text-[12px] font-semibold text-text-primary uppercase tracking-wider">
                  Build Logs
                </span>
                {isLogsLoading && (
                  <Loader2
                    size={12}
                    className="animate-spin text-text-muted"
                  />
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyLogs}
                  className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                  title="Copy logs"
                >
                  {copied ? (
                    <Check size={13} className="text-emerald-500" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
                <button
                  onClick={handleDownloadLogs}
                  className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                  title="Download logs"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>
            <div ref={logsRef} className="flex-1 overflow-y-auto p-4">
              {isLogsLoading && !logs ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2
                      size={20}
                      className="animate-spin text-text-muted"
                    />
                    <p className="text-[12px] text-text-muted">
                      Loading build logs...
                    </p>
                  </div>
                </div>
              ) : (
                <pre className="terminal-text text-text-secondary whitespace-pre-wrap break-words">
                  {logs}
                </pre>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right: Status & Info */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-4">
              Deployment Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-text-secondary">Status</span>
                <StatusBadge status={project.status} size="sm" />
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-text-secondary">
                  Created
                </span>
                <span className="text-[12px] text-text-muted">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-text-secondary">
                  Framework
                </span>
                <span className="text-[12px] text-text-muted">
                  {project.framework || "Auto-detect"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Usage Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <h3 className="text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-3">
              Usage
            </h3>
            <p className="text-[13px] text-text-muted">
              Metrics will appear once the project receives traffic.
            </p>
          </motion.div>
        </div>
      </div>

      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ProjectDetail;
