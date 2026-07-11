import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const slideLeft = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const slideRight = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage() {
  const { user, isLoading, login } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="bg-[#000000] text-[#EDEDED] selection:bg-primary selection:text-background min-h-screen overflow-x-hidden font-sans">
      
      {/* Refined Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-black/50 backdrop-blur-md border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-[15px] font-semibold tracking-wide uppercase text-white">ShipIt</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={login} className="text-[13px] text-[#A1A1A1] hover:text-white transition-colors font-medium">Log In</button>
          <button onClick={login} className="text-[13px] font-medium bg-white text-black px-4 py-1.5 rounded-[6px] hover:bg-[#EAEAEA] transition-colors">
            Sign Up
          </button>
        </div>
      </motion.nav>

      <main className="relative pt-32 md:pt-48">
        
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, white 0%, transparent 80%)' }}></div>
        
        {/* Hero Section */}
        <section className="relative px-6 md:px-12 mx-auto max-w-5xl flex flex-col items-center text-center pb-32">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={slideUp} className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span className="text-[11px] font-medium text-[#A1A1A1] uppercase tracking-widest">Systems Operational</span>
            </motion.div>
            
            <motion.h1 variants={slideUp} className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-tight text-white mb-6 leading-[1.1] max-w-4xl">
              Develop. Preview. Ship.
            </motion.h1>
            
            <motion.p variants={slideUp} className="text-[17px] md:text-[20px] text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Vercel-like platform for frontend frameworks and static sites, built to integrate with your headless content, commerce, or database.
            </motion.p>
            
            <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-center gap-4">
              <button onClick={login} className="w-full sm:w-auto bg-white text-black text-[14px] font-medium px-8 py-3 rounded-[8px] hover:bg-[#EAEAEA] transition-all flex items-center justify-center gap-2">
                Start Deploying
              </button>
              <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white text-[14px] font-medium px-8 py-3 rounded-[8px] hover:bg-white/5 transition-all">
                Get a Demo
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="relative px-6 md:px-12 mx-auto max-w-6xl pb-32">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
            className="rounded-[12px] border border-white/10 bg-black overflow-hidden shadow-2xl relative"
          >
             <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#0A0A0A]">
                <div className="w-3 h-3 rounded-full bg-[#ED6A5E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#F4BF4F]"></div>
                <div className="w-3 h-3 rounded-full bg-[#61C554]"></div>
             </div>
             <img
                className="w-full object-cover opacity-90"
                alt="Dashboard UI"
                src="https://res.cloudinary.com/dghq3or5w/image/upload/v1782191068/shipit_vhoyvc.png"
             />
          </motion.div>
        </section>

        {/* Features / Architecture */}
        <section className="py-24 border-t border-white/5 bg-[#000000]">
          <div className="px-6 md:px-12 mx-auto max-w-6xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="text-center mb-20"
            >
              <motion.h2 variants={slideUp} className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">Explore the Edge</motion.h2>
              <motion.p variants={slideUp} className="text-[17px] text-[#888888] max-w-2xl mx-auto">Ship directly to the edge with zero configuration. Global by default.</motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Native GitHub Integration", desc: "Push to main and watch your application deploy globally in seconds. Pull request previews generated automatically." },
                { title: "Edge Architecture", desc: "Your application is replicated across 100+ global edge nodes. Sub-millisecond latency for users worldwide." },
                { title: "Immutable Deployments", desc: "Every commit generates a unique URL. Safely share previews with your team before merging." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={slideUp}
                  className="p-8 rounded-[12px] border border-white/10 bg-[#0A0A0A] hover:border-white/20 transition-colors"
                >
                  <h3 className="text-[18px] font-medium text-white mb-3">{feature.title}</h3>
                  <p className="text-[14px] text-[#A1A1A1] leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-32 border-t border-white/5 bg-[#000000] relative overflow-hidden">
          <div className="px-6 md:px-12 mx-auto max-w-7xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="mb-20"
            >
              <motion.h2 variants={slideUp} className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
                The workflow for modern teams.
              </motion.h2>
              <motion.p variants={slideUp} className="text-[18px] text-[#888888] max-w-2xl">
                We've optimized every step of the deployment pipeline so your team can focus on what matters most: building great products.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Connect Repository", desc: "Link your GitHub account and select your project. We'll automatically clone and prepare your codebase." },
                { step: "2", title: "Configure Settings", desc: "Our build engine automatically detects your framework and sets up the optimal environment variables." },
                { step: "3", title: "Deploy", desc: "Hit deploy and watch your application build in real-time, streaming logs directly to your dashboard." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={slideUp}
                  className="flex flex-col h-full border border-white/10 rounded-[12px] bg-[#0A0A0A] p-8 hover:bg-[#111] transition-colors"
                >
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[16px] font-medium text-white mb-8 bg-white/5">
                    {item.step}
                  </div>
                  <h4 className="text-[20px] font-medium text-white mb-3">{item.title}</h4>
                  <p className="text-[15px] text-[#A1A1A1] leading-relaxed flex-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Expanded UI Status Bar Preview */}
            <motion.div 
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               variants={slideUp}
               className="mt-12 border border-white/10 rounded-[12px] bg-[#0A0A0A] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
            >
               <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                 </div>
                 <div>
                   <div className="text-[14px] text-white font-medium">shipit-landing-page</div>
                   <div className="text-[13px] text-[#888]">Production • main</div>
                 </div>
               </div>
               <div className="w-full md:flex-1 max-w-md bg-white/5 rounded-full h-2 overflow-hidden flex">
                  <div className="w-full bg-[#10B981] h-full rounded-full"></div>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                 <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                 <span className="text-[14px] font-medium text-white">Deployed</span>
                 <span className="text-[13px] text-[#888] ml-2">2m ago</span>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Global Edge & Monitoring Section */}
        <section className="py-32 border-t border-b border-white/5 bg-[#000000] relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none -translate-y-1/2"></div>
          <div className="px-6 md:px-12 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={slideRight}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                  <span className="text-[11px] font-medium text-[#A1A1A1] uppercase tracking-widest">Real-time Visibility</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6 leading-snug">
                  Global Edge Network
                </h2>
                <p className="text-[18px] text-[#888888] mb-12 max-w-lg leading-relaxed">
                  Monitor your deployments in real-time across 100+ global edge nodes. Get instant feedback with granular status tracking.
                </p>
                
                <div className="flex flex-col gap-4 max-w-md">
                  {/* Status UI Components */}
                  <div className="flex items-center justify-between p-5 rounded-[12px] border border-white/10 bg-[#0A0A0A] shadow-lg hover:border-white/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white font-medium mb-1">Production Build</span>
                      <span className="text-[12px] text-[#888]">commit: 8f3a9b2</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                      <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                      <span className="text-[12px] text-green-500 font-medium tracking-wide">Success</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-[12px] border border-white/10 bg-[#0A0A0A] shadow-lg hover:border-white/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white font-medium mb-1">Preview Deployment</span>
                      <span className="text-[12px] text-[#888]">commit: 2c1e8f4</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                      <span className="text-[12px] text-orange-500 font-medium tracking-wide">Building</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-[12px] border border-white/10 bg-[#0A0A0A] shadow-lg hover:border-white/20 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[14px] text-white font-medium mb-1">Edge Node Sync</span>
                      <span className="text-[12px] text-[#888]">commit: 5d8a1c9</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                      <span className="text-[12px] text-red-500 font-medium tracking-wide">Failed</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={slideLeft}
                className="relative flex justify-center items-center h-[500px]"
              >
                {/* Abstract Globe / Nodes visualization */}
                <div className="relative w-80 h-80 rounded-full flex items-center justify-center">
                  {/* Concentric rings */}
                  <div className="absolute w-80 h-80 border border-white/5 rounded-full"></div>
                  <div className="absolute w-64 h-64 border border-white/10 rounded-full bg-white/[0.01]"></div>
                  <div className="absolute w-40 h-40 border border-white/10 rounded-full bg-white/[0.02]"></div>
                  
                  {/* Axis lines */}
                  <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                  <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  
                  {/* Glowing Nodes representing edge servers */}
                  <div className="absolute top-[15%] left-[25%] flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,1)] animate-pulse"></div>
                    <span className="text-[10px] text-white mt-2 font-mono opacity-50">NYC-1</span>
                  </div>
                  
                  <div className="absolute bottom-[20%] right-[15%] flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]"></div>
                    <span className="text-[10px] text-white mt-2 font-mono opacity-50">SFO-2</span>
                  </div>
                  
                  <div className="absolute top-[40%] right-[10%] flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)] animate-ping" style={{animationDuration: '2s'}}></div>
                    <span className="text-[10px] text-white mt-2 font-mono opacity-50">LHR-1</span>
                  </div>

                  <div className="absolute bottom-[30%] left-[10%] flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-[10px] text-white mt-2 font-mono opacity-50">FRA-3</span>
                  </div>
                  
                  <div className="absolute top-[20%] right-[30%] flex flex-col items-center">
                     <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 border-t border-white/5 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-[100%] pointer-events-none"></div>
          
          <div className="px-6 md:px-12 mx-auto max-w-7xl relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[24px] p-12 md:p-20 text-center shadow-2xl"
            >
              <motion.h2 variants={slideUp} className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">Build the future.</motion.h2>
              <motion.p variants={slideUp} className="text-[18px] md:text-[20px] text-[#888888] mb-12 max-w-2xl mx-auto font-light">
                Start deploying your applications with industry-leading performance, zero configuration, and incredible reliability.
              </motion.p>
              <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={login} className="w-full sm:w-auto bg-white text-black text-[15px] font-medium px-10 py-4 rounded-[8px] hover:bg-[#EAEAEA] transition-all hover:scale-105 duration-300">
                  Start Deploying Now
                </button>
                <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white text-[15px] font-medium px-10 py-4 rounded-[8px] hover:bg-white/5 transition-all">
                  Contact Sales
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 bg-[#0A0A0A]">
          <div className="px-6 md:px-12 mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-[#888]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-[13px] text-[#888] tracking-widest uppercase">ShipIt</span>
            </div>
            <div className="flex items-center gap-6">
              {['Features', 'Docs', 'Pricing', 'Privacy'].map((link) => (
                <a key={link} href="#" className="text-[13px] text-[#888] hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
