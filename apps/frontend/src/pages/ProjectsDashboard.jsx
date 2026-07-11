import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";

function ProjectsDashboard() {
  const { user, isLoading } = useAuth();
  const [deployments, setDeployments] = useState([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  // Load deployments from PostgreSQL
  useEffect(() => {
    if (!user) return;
    const fetchDeployments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/deployments", {
          withCredentials: true,
        });

        const formatted = res.data.map((deployment) => ({
          projectId: deployment.id,
          repoUrl: deployment.repoUrl,
          status: deployment.status,
          deploymentUrl: deployment.deploymentUrl,
          createdAt: deployment.createdAt,
        }));

        setDeployments(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDeployments();
  }, []);

  // Poll deployment status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updated = await Promise.all(
          deployments.map(async (deployment) => {
            const res = await axios.get(`http://localhost:3000/status/${deployment.projectId}`);
            return {
              ...deployment,
              status: res.data.status,
              deploymentUrl: res.data.deploymentUrl,
            };
          })
        );
        setDeployments(updated);
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [deployments]);

  const deploy = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;
    setIsDeploying(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/deploy",
        { repoUrl },
        { withCredentials: true }
      );

      const deployment = {
        projectId: res.data.projectId,
        status: res.data.status,
        createdAt: new Date().toISOString(),
      };

      setDeployments([deployment, ...deployments]);
      setRepoUrl("");
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeploying(false);
    }
  };

  const successfulDeployments = deployments.filter(d => d.status === "deployed").length;
  const failedDeployments = deployments.filter(d => d.status === "failed").length;

  if (!isLoading && !user) {
    return <Navigate to="/" />;
  }

  return (
    <DashboardLayout>
      <div className="p-lg space-y-lg">
        {/* Breadcrumb & CTA Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Projects</h2>
            <p className="text-on-surface-variant font-body-sm text-body-sm">Manage your production environments and deployment cycles.</p>
          </div>
          <button className="bg-primary text-background font-label-md text-label-md py-sm px-xl rounded-lg font-bold flex items-center gap-sm active:scale-95 transition-transform hover:bg-primary-fixed">
            <span className="material-symbols-outlined !text-[18px]">add</span>
            New Project
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {/* Stat Card */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-lg flex flex-col gap-xs hover:border-outline transition-colors">
            <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Total Projects</span>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-xl text-headline-xl text-primary">{deployments.length}</span>
            </div>
          </div>

          {/* Stat Card */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-lg flex flex-col gap-xs hover:border-outline transition-colors">
            <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Total Deployments</span>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-xl text-headline-xl text-primary">{deployments.length}</span>
            </div>
          </div>

          {/* Stat Card Success */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-lg flex flex-col gap-xs hover:border-outline transition-colors border-l-4 border-l-green-500/50">
            <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Successful</span>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-xl text-headline-xl text-primary">{successfulDeployments}</span>
              <span className="material-symbols-outlined text-green-400 !text-[16px]">trending_up</span>
            </div>
          </div>

          {/* Stat Card Failed */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-lg flex flex-col gap-xs hover:border-outline transition-colors border-l-4 border-l-red-500/50">
            <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Failed</span>
            <div className="flex items-baseline gap-sm">
              <span className="font-headline-xl text-headline-xl text-primary">{failedDeployments}</span>
            </div>
          </div>
        </div>

        {/* New Deploy Form (Import from GitHub Section styling) */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg mb-lg">
          <div className="flex items-start justify-between mb-lg">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-xs">Deploy Repository</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Connect your GitHub repository to enable automatic deployments.</p>
            </div>
            <div className="w-10 h-10 bg-surface-container rounded flex items-center justify-center">
              <span className="material-symbols-outlined">cloud_upload</span>
            </div>
          </div>

          <form onSubmit={deploy} className="flex gap-md">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg py-sm px-md text-body-md focus:outline-none focus:border-outline transition-colors text-on-surface"
              disabled={isDeploying}
            />
            <button 
              type="submit" 
              disabled={isDeploying || !repoUrl}
              className="bg-primary text-background font-label-md text-label-md py-sm px-xl rounded-lg font-bold flex items-center gap-sm active:scale-95 transition-transform hover:bg-primary-fixed disabled:opacity-50"
            >
              <span className="material-symbols-outlined !text-[18px]">rocket_launch</span>
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </button>
          </form>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {deployments.map((deployment) => (
            <div key={deployment.projectId} className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex flex-col gap-md hover:bg-surface-container-high transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-xs">
                  <h3 className="font-headline-md text-headline-md text-primary group-hover:text-tertiary truncate max-w-[200px]" title={deployment.projectId}>
                    {deployment.projectId}
                  </h3>
                  <div className="flex items-center gap-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      deployment.status === "deployed" ? "bg-green-500" :
                      deployment.status === "failed" ? "bg-red-500" : "bg-yellow-500 animate-pulse"
                    }`}></div>
                    <span className="text-on-surface-variant font-label-md text-label-md capitalize">Status: {deployment.status}</span>
                  </div>
                </div>
                <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">more_vert</button>
              </div>

              <div className="h-px bg-outline-variant w-full"></div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col">
                  <span className="text-on-surface-variant font-label-sm text-label-sm">Created</span>
                  <span className="text-primary font-body-sm text-body-sm">{new Date(deployment.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-on-surface-variant font-label-sm text-label-sm">Repo</span>
                  <a href={deployment.repoUrl} target="_blank" rel="noreferrer" className="text-primary font-body-sm text-body-sm truncate hover:underline">
                    {deployment.repoUrl ? deployment.repoUrl.split('/').slice(-2).join('/') : "Unknown"}
                  </a>
                </div>
              </div>

              <div className="mt-auto pt-sm flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">JS</div>
                </div>
                <Link to={`/projects/${deployment.projectId}`} className="text-primary font-label-md text-label-md flex items-center gap-xs group-hover:gap-sm transition-all">
                  View Project
                  <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}

          {/* Empty State Suggestion Card */}
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-md flex flex-col items-center justify-center text-center gap-sm hover:border-outline transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">add</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-primary">Add a new project</h4>
              <p className="text-on-surface-variant font-label-sm text-label-sm">Import from GitHub or start from a template</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default ProjectsDashboard;
