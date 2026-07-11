import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ExternalLink,
  RotateCw,
  FileText,
  Trash2,
  Copy,
  Check,
  Loader2,
  GitBranch,
} from "lucide-react";
import {
  extractRepoName,
  extractRepoShortName,
  formatRelativeTime,
} from "../../lib/utils";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";

export default function DeploymentCard({
  deployment,
  index = 0,
  onViewLogs,
  onRedeploy,
  onDelete,
  isDeleting,
}) {
  const [copied, setCopied] = useState(false);
  const repoShortName = extractRepoShortName(deployment.repoUrl);
  const repoFullName = extractRepoName(deployment.repoUrl);

  const handleCopyUrl = (e) => {
    e.stopPropagation();
    if (!deployment.deploymentUrl) return;
    navigator.clipboard.writeText(deployment.deploymentUrl);
    setCopied(true);
    toast.success("Copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-card border border-border rounded-xl p-5 hover:border-border-hover transition-colors flex flex-col justify-between h-full group"
    >
      {/* Top section */}
      <div className="space-y-4">
        {/* Header: Project Name + Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              to={`/projects/${deployment.id}`}
              className="text-[15px] font-semibold text-text-primary hover:text-white truncate block leading-tight"
            >
              {repoShortName}
            </Link>
            <div className="flex items-center gap-1.5 mt-1 text-[12px] text-text-muted truncate">
              <GitBranch size={12} className="shrink-0" />
              <span className="truncate">{repoFullName}</span>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={deployment.status} size="sm" />
          </div>
        </div>

        {/* Metadata info */}
        <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
          <span>Created {formatRelativeTime(deployment.createdAt)}</span>
        </div>

        {/* Deployment URL box with Copy button */}
        {deployment.deploymentUrl ? (
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-background rounded-lg border border-border">
            <a
              href={deployment.deploymentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] text-text-secondary hover:text-text-primary transition-colors truncate block font-mono flex-1 min-w-0"
            >
              {deployment.deploymentUrl.replace(/^https?:\/\//, "")}
            </a>
            <button
              onClick={handleCopyUrl}
              title="Copy Deployment URL"
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors shrink-0 flex items-center justify-center"
            >
              {copied ? (
                <Check size={13} className="text-emerald-500" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        ) : (
          <div className="px-3 py-2 bg-background/50 rounded-lg border border-border/50 text-[12px] text-text-muted font-mono truncate">
            No URL ready yet
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="pt-4 mt-4 border-t border-border flex flex-col gap-2.5">
        <div className="flex items-center flex-wrap gap-1.5">
          {deployment.deploymentUrl && (
            <a
              href={deployment.deploymentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
            >
              <ExternalLink size={12} />
              Visit
            </a>
          )}

          {onViewLogs && (
            <button
              onClick={() => onViewLogs(deployment)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
            >
              <FileText size={12} />
              Logs
            </button>
          )}

          {onRedeploy && (
            <button
              onClick={() => onRedeploy(deployment)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
            >
              <RotateCw size={12} />
              Redeploy
            </button>
          )}
        </div>

        {onDelete && (
          <div className="pt-2 border-t border-border/40 flex justify-end">
            <button
              onClick={() => onDelete(deployment)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={12} />
                  Delete Deployment
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
