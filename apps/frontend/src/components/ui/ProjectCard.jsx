import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import { extractRepoName, extractRepoShortName, formatRelativeTime } from "../../lib/utils";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ deployment, index = 0 }) {
  const repoName = extractRepoShortName(deployment.repoUrl);
  const repoFullName = extractRepoName(deployment.repoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/projects/${deployment.id || deployment.projectId}`}
        className="block bg-card border border-border rounded-xl p-4 hover:border-border-hover hover:bg-card-hover transition-all group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
              <GitBranch size={14} className="text-text-muted" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-text-primary truncate leading-tight">
                {repoName}
              </h3>
              <p className="text-[11px] text-text-muted truncate">
                {repoFullName}
              </p>
            </div>
          </div>
          <StatusBadge status={deployment.status} size="sm" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-[11px] text-text-muted">
            {formatRelativeTime(deployment.createdAt)}
          </span>
          <span className="text-[12px] text-text-secondary font-medium flex items-center gap-1 group-hover:text-text-primary group-hover:gap-1.5 transition-all">
            View
            <ArrowRight size={12} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
