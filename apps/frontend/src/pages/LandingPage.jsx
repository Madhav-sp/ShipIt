import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Rocket,
  GitBranch,
  Container,
  HardDrive,
  Globe,
  ArrowRight,
  Terminal,
  Zap,
  Shield,
  Eye,
  ChevronRight,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function LandingPage() {
  const { user, isLoading, login } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="bg-background text-text-primary min-h-screen overflow-x-hidden">
      {/* ===================== NAVIGATION ===================== */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 md:px-8 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <Rocket size={12} className="text-background" />
          </div>
          <span className="text-[14px] font-semibold tracking-tight">
            Deployr
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={login}
            className="text-[13px] text-text-muted hover:text-text-primary transition-colors font-medium"
          >
            Log in
          </button>
          <button
            onClick={login}
            className="text-[13px] font-medium bg-white text-background px-4 py-1.5 rounded-lg hover:bg-accent-hover transition-colors"
          >
            Sign up
          </button>
        </div>
      </motion.nav>

      <main>
        {/* ===================== HERO ===================== */}
        <section className="relative pt-32 md:pt-44 pb-24 md:pb-32 px-5 md:px-8">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
            style={{
              maskImage:
                "linear-gradient(to bottom, white 0%, transparent 70%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, white 0%, transparent 70%)",
            }}
          />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative max-w-3xl mx-auto text-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card mb-8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-widest">
                All systems operational
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl lg:text-[64px] font-semibold tracking-tight leading-[1.1] mb-5"
            >
              Push. Build. Ship.
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-base md:text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Deploy your GitHub repositories to production in seconds.
              Docker-powered builds. S3 hosting. CloudFront CDN. Zero config.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button
                onClick={login}
                className="w-full sm:w-auto bg-white text-background text-[14px] font-semibold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
              >
                Start Deploying
                <ArrowRight size={15} />
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto border border-border text-text-secondary text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-card hover:text-text-primary hover:border-border-hover transition-colors text-center"
              >
                View on GitHub
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ===================== PIPELINE ===================== */}
        <section className="py-20 md:py-28 border-t border-border">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl md:text-4xl font-semibold tracking-tight mb-3"
              >
                How Deployr Works
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-[15px] text-text-muted max-w-lg mx-auto"
              >
                From git push to production URL in under 60 seconds.
              </motion.p>
            </motion.div>

            {/* Pipeline Steps */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0 items-center"
            >
              {[
                { icon: GitBranch, label: "GitHub Push", desc: "Push to any branch" },
                { icon: Container, label: "Docker Build", desc: "Containerized build" },
                { icon: HardDrive, label: "S3 Upload", desc: "Static asset storage" },
                { icon: Globe, label: "CloudFront CDN", desc: "Global edge delivery" },
                { icon: Rocket, label: "Production", desc: "Live URL ready" },
              ].map((step, i) => (
                <motion.div key={i} variants={fadeIn} className="flex items-center">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-3">
                      <step.icon size={20} className="text-text-secondary" />
                    </div>
                    <h4 className="text-[13px] font-semibold text-text-primary mb-0.5">
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-text-muted">{step.desc}</p>
                  </div>
                  {i < 4 && (
                    <ChevronRight
                      size={16}
                      className="text-text-muted shrink-0 mx-2 hidden md:block"
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===================== ARCHITECTURE ===================== */}
        <section className="py-20 md:py-28 border-t border-border bg-surface">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl md:text-4xl font-semibold tracking-tight mb-3"
              >
                Built on Production Infrastructure
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-[15px] text-text-muted max-w-lg mx-auto"
              >
                Every deployment runs through a battle-tested pipeline.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Terminal-style architecture view */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-2 text-[11px] text-text-muted font-mono">
                  deployr-architecture
                </span>
              </div>
              <div className="p-6 font-mono text-[12px] md:text-[13px] leading-relaxed">
                <motion.div variants={fadeIn}>
                  <span className="text-text-muted">{"$ "}</span>
                  <span className="text-emerald-500">deployr</span>
                  <span className="text-text-secondary"> deploy</span>
                  <span className="text-text-muted"> --repo github.com/user/app</span>
                </motion.div>
                <motion.div variants={fadeIn} className="mt-4 space-y-1.5">
                  <p className="text-text-muted">
                    <span className="text-text-secondary">→</span> Cloning repository...
                  </p>
                  <p className="text-text-muted">
                    <span className="text-text-secondary">→</span> Building Docker image...
                  </p>
                  <p className="text-text-muted">
                    <span className="text-text-secondary">→</span> Running build command: <span className="text-amber-500">npm run build</span>
                  </p>
                  <p className="text-text-muted">
                    <span className="text-text-secondary">→</span> Uploading to S3: <span className="text-text-secondary">42 files (2.3 MB)</span>
                  </p>
                  <p className="text-text-muted">
                    <span className="text-text-secondary">→</span> Invalidating CloudFront cache...
                  </p>
                  <p className="text-emerald-500 mt-3">
                    ✓ Deployed to https://app-a1b2c3.deployr.dev
                  </p>
                  <p className="text-text-muted text-[11px] mt-1">
                    Build time: 34s • Size: 2.3 MB • Region: us-east-1
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===================== FEATURES ===================== */}
        <section className="py-20 md:py-28 border-t border-border">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl md:text-4xl font-semibold tracking-tight mb-3"
              >
                Everything You Need to Ship
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-[15px] text-text-muted max-w-lg mx-auto"
              >
                Real features for real deployments. No fluff.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: GitBranch,
                  title: "GitHub Integration",
                  desc: "Connect any public repository. Paste the URL and deploy. OAuth-powered authentication.",
                },
                {
                  icon: Container,
                  title: "Docker Builds",
                  desc: "Every build runs in an isolated Docker container. Reproducible, consistent, reliable.",
                },
                {
                  icon: Terminal,
                  title: "Real-time Build Logs",
                  desc: "Stream build output live to your dashboard. Debug issues as they happen.",
                },
                {
                  icon: HardDrive,
                  title: "S3 Static Hosting",
                  desc: "Build artifacts uploaded directly to AWS S3. Durable, scalable object storage.",
                },
                {
                  icon: Globe,
                  title: "CloudFront CDN",
                  desc: "Every deployment served from AWS CloudFront edge locations. Fast globally.",
                },
                {
                  icon: Zap,
                  title: "Queue-based Processing",
                  desc: "BullMQ handles deployment jobs. Redis-backed queue ensures reliability at scale.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="p-6 rounded-xl border border-border bg-card hover:border-border-hover transition-colors"
                >
                  <feature.icon
                    size={20}
                    className="text-text-secondary mb-4"
                  />
                  <h3 className="text-[15px] font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===================== WORKFLOW ===================== */}
        <section className="py-20 md:py-28 border-t border-border bg-surface">
          <div className="max-w-5xl mx-auto px-5 md:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeIn}
                className="text-2xl md:text-4xl font-semibold tracking-tight mb-3"
              >
                Developer Workflow
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-[15px] text-text-muted max-w-lg mb-12"
              >
                Three steps. That's it.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                {
                  step: "01",
                  title: "Authenticate",
                  desc: "Sign in with GitHub. Your repositories are instantly accessible.",
                },
                {
                  step: "02",
                  title: "Paste & Deploy",
                  desc: "Enter a GitHub repo URL. Click deploy. The build starts immediately.",
                },
                {
                  step: "03",
                  title: "Monitor & Ship",
                  desc: "Watch build logs in real-time. Get a production URL when it's ready.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="p-6 rounded-xl border border-border bg-card hover:border-border-hover transition-colors"
                >
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">
                    Step {item.step}
                  </span>
                  <h4 className="text-[18px] font-semibold text-text-primary mt-3 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-[13px] text-text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ===================== CTA ===================== */}
        <section className="py-24 md:py-32 border-t border-border">
          <div className="max-w-3xl mx-auto px-5 md:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center"
            >
              <motion.h2
                variants={fadeIn}
                className="text-3xl md:text-5xl font-semibold tracking-tight mb-4"
              >
                Ready to ship?
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-[16px] text-text-muted mb-10 max-w-md mx-auto"
              >
                Deploy your first project in under a minute. No credit card
                required.
              </motion.p>
              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <button
                  onClick={login}
                  className="w-full sm:w-auto bg-white text-background text-[14px] font-semibold px-8 py-3.5 rounded-lg hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
                >
                  Start Deploying
                  <ArrowRight size={15} />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer className="py-8 border-t border-border">
          <div className="max-w-5xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                <Rocket size={10} className="text-background" />
              </div>
              <span className="text-[12px] text-text-muted">Deployr</span>
            </div>
            <div className="flex items-center gap-6">
              {["GitHub", "Docs", "Privacy"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[12px] text-text-muted hover:text-text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
