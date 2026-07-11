import { motion } from "framer-motion";
import { ExternalLink, RotateCw, FileText } from "lucide-react";
import { extractRepoName, formatRelativeTime } from "../../lib/utils";
import StatusBadge from "./StatusBadge";

export default function DeploymentCard({
  deployment,
  index = 0,
  onViewLogs,
  onRedeploy,
}) {
  const repoName = extractRepoName(deployment.repoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="bg-card border border-border rounded-xl p-4 hover:border-border-hover transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h4 className="text-[14px] font-semibold text-text-primary truncate">
            {repoName}
          </h4>
          <p className="text-[11px] text-text-muted mt-0.5">
            {formatRelativeTime(deployment.createdAt)}
          </p>
        </div>
        <StatusBadge status={deployment.status} size="sm" />
      </div>

      {/* Deployment URL */}
      {deployment.deploymentUrl && (
        <div className="mb-3 px-3 py-2 bg-background rounded-lg border border-border">
          <a
            href={deployment.deploymentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[12px] text-text-secondary hover:text-text-primary transition-colors truncate block font-mono"
          >
            {deployment.deploymentUrl.replace(/^https?:\/\//, "")}
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        {deployment.deploymentUrl && (
          <a
            href={deployment.deploymentUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          >
            <ExternalLink size={12} />
            Visit
          </a>
        )}
        {onViewLogs && (
          <button
            onClick={() => onViewLogs(deployment)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          >
            <FileText size={12} />
            Logs
          </button>
        )}
        {onRedeploy && (
          <button
            onClick={() => onRedeploy(deployment)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors ml-auto"
          >
            <RotateCw size={12} />
            Redeploy
          </button>
        )}
      </div>
    </motion.div>
  );
}
