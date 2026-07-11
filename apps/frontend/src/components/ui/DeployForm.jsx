import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export default function DeployForm({ onDeploy, isDeploying }) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim() || isDeploying) return;
    onDeploy(repoUrl.trim());
    setRepoUrl("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary mb-1">
            Deploy Repository
          </h3>
          <p className="text-[13px] text-text-muted">
            Enter a GitHub repository URL to deploy.
          </p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center">
          <Rocket size={16} className="text-text-muted" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/user/repo"
          disabled={isDeploying}
          className={cn(
            "flex-1 bg-background border border-border rounded-lg px-4 py-2.5",
            "text-[14px] text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:border-border-hover transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <button
          type="submit"
          disabled={isDeploying || !repoUrl.trim()}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg",
            "bg-white text-background text-[13px] font-semibold",
            "hover:bg-accent-hover active:scale-[0.98] transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
            "shrink-0"
          )}
        >
          {isDeploying ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <Rocket size={14} />
              Deploy
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
