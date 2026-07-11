import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";

function ProjectDetail() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [logs, setLogs] = useState("");
  const [isLogsLoading, setIsLogsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  // Fetch project details
  useEffect(() => {
    if (!user) return;
    const fetchProject = async () => {
      try {
        const res = await axios.get("http://localhost:3000/deployments", {
          withCredentials: true,
        });
        const found = res.data.find(d => d.id === id);
        if (found) {
          setProject({
            projectId: found.id,
            repoUrl: found.repoUrl,
            status: found.status,
            deploymentUrl: found.deploymentUrl,
            createdAt: found.createdAt,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProject();
  }, [id]);

  // Fetch logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/deployment/${id}`, {
          withCredentials: true,
        });
        setLogs(res.data.logs || "No logs available yet.");
      } catch (err) {
        setLogs("Error loading logs.");
      } finally {
        setIsLogsLoading(false);
      }
    };
    
    fetchLogs();
    
    // Poll logs and status while building
    const interval = setInterval(async () => {
      try {
        const logRes = await axios.get(`http://localhost:3000/deployment/${id}`, {
          withCredentials: true,
        });
        setLogs(logRes.data.logs || "No logs available yet.");

        const statusRes = await axios.get(`http://localhost:3000/status/${id}`);
        setProject(prev => {
          if(!prev) return prev;
          return {
            ...prev,
            status: statusRes.data.status,
            deploymentUrl: statusRes.data.deploymentUrl,
          }
        });
      } catch (err) {
        // Only set error if we don't have logs yet, to prevent overriding existing logs on a network blip
        if (!logs || logs === "Error loading logs." || logs === "No logs available yet.") {
          setLogs(`Error loading logs: ${err.message}`);
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [id, user]);

  const handleRedeploy = async () => {
    if (!project || !project.repoUrl) return;
    setIsDeploying(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/deploy",
        { repoUrl: project.repoUrl },
        { withCredentials: true }
      );
      // Navigate to the new deployment ID created by the backend
      navigate(`/projects/${res.data.projectId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isLoading && !user) {
    return <Navigate to="/" />;
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="p-lg flex items-center justify-center h-full">
          <p className="text-on-surface-variant">Loading project details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-lg">
        {/* Page Header */}
        <section className="flex items-center justify-between mb-xl">
          <div className="flex items-center gap-md">
            <h2 className="font-headline-xl text-headline-xl text-primary tracking-tight">{project.projectId}</h2>
            <div className="flex items-center gap-xs px-sm py-[2px] bg-secondary-container rounded-full">
              <span className={`w-2 h-2 rounded-full ${
                      project.status === "deployed" ? "bg-green-500 status-pulse" :
                      project.status === "failed" ? "bg-red-500" : "bg-yellow-500 animate-pulse"
                    }`}></span>
              <span className="font-label-sm text-label-sm text-on-secondary-container capitalize">{project.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="px-md py-base flex items-center gap-sm border border-outline-variant text-on-surface hover:bg-surface-container transition-colors rounded-lg">
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>source</span>
              <span className="font-label-md text-label-md">GitHub</span>
            </a>
            {project.deploymentUrl && (
              <a href={project.deploymentUrl} target="_blank" rel="noreferrer" className="px-md py-base flex items-center gap-sm bg-primary text-background font-bold hover:opacity-90 transition-opacity rounded-lg">
                <span className="font-label-md text-label-md">Visit</span>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>open_in_new</span>
              </a>
            )}
            <button 
              onClick={handleRedeploy} 
              disabled={isDeploying}
              className="px-md py-base flex items-center gap-sm bg-surface-container border border-outline hover:bg-surface-container-high transition-colors rounded-lg disabled:opacity-50"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>refresh</span>
              <span className="font-label-md text-label-md">{isDeploying ? 'Deploying...' : 'Redeploy'}</span>
            </button>
          </div>
        </section>

        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-lg">
          {/* Left Column: Primary Deployment Info & Logs */}
          <div className="col-span-12 lg:col-span-8 space-y-lg">
            {/* Production Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group">
              <div className="p-md bottom-border bg-surface-container-low flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold tracking-wider uppercase">Current Deployment</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Created: {new Date(project.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-lg border-r border-outline-variant">
                  <div className="aspect-video bg-surface-container rounded-lg overflow-hidden relative card-border flex items-center justify-center">
                     <span className="material-symbols-outlined text-outline-variant text-[48px]">imagesmode</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-lg space-y-md flex flex-col justify-center">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs">Deployment URL</p>
                    {project.deploymentUrl ? (
                      <a href={project.deploymentUrl} target="_blank" rel="noreferrer" className="font-body-md text-body-md text-primary hover:underline flex items-center gap-xs">
                        {project.deploymentUrl.replace(/^https?:\/\//, '')}
                        <span className="material-symbols-outlined text-[16px]">link</span>
                      </a>
                    ) : (
                      <p className="font-body-md text-body-md text-on-surface-variant">Not available</p>
                    )}
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs">Repository</p>
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-on-surface-variant">account_tree</span>
                      <code className="font-body-sm text-body-sm bg-surface-container-high px-sm py-1 rounded text-primary truncate max-w-[200px]">
                        {project.repoUrl}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs Section */}
            <div className="bg-[#09090B] border border-outline-variant rounded-xl overflow-hidden flex flex-col h-[500px]">
              <div className="p-md border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">terminal</span>
                  <span className="font-label-md text-label-md text-primary font-semibold tracking-wider uppercase">Build Logs</span>
                </div>
                {isLogsLoading && <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>}
              </div>
              <div className="flex-1 p-md overflow-y-auto custom-scrollbar bg-black">
                <pre className="font-mono text-body-sm text-[#A1A1AA] whitespace-pre-wrap">
                  {logs}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column: Activity / Recent Deployments */}
          <div className="col-span-12 lg:col-span-4 space-y-lg">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <div className="flex items-center justify-between mb-lg">
                <h3 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">Deployment Status</h3>
              </div>
              <div className="space-y-sm">
                <div className="group p-md rounded-lg hover:bg-surface-container-low transition-colors card-border bg-background">
                  <div className="flex items-center justify-between mb-sm">
                    <div className="flex items-center gap-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        project.status === "deployed" ? "bg-green-500" :
                        project.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                      }`}></div>
                      <span className={`font-body-sm text-body-sm font-semibold ${
                        project.status === "deployed" ? "text-green-500" :
                        project.status === "failed" ? "text-red-500" : "text-yellow-500"
                      }`}>{project.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-on-surface-variant line-clamp-1 mb-md italic">Latest update</p>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
               <h3 className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider mb-lg">Usage</h3>
               <p className="text-on-surface-variant font-body-sm">Metrics will appear here once the project receives traffic.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProjectDetail;
