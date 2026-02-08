import React from 'react';
import {Link} from 'react-router-dom'

// Icon Components
const Icons = {
  Square: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 3.75h16.5v16.5H3.75V3.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 7.5c0-1.657 1.343-3 3-3 1.657 0 3 1.343 3 3 0 3-6.167 1.875-6.167 4.5C8.833 12.992 10.009 14 11.667 14c1.242 0 2.215-.563 2.625-1.374" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Heart: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21c0 0-9.75-5.25-9.75-11.437C2.25 6.767 4.517 4.5 7.313 4.5c2.117 0 3.931 1.154 4.687 3 .756-1.846 2.57-3 4.688-3C19.483 4.5 21.75 6.767 21.75 9.563 21.75 15.75 12 21 12 21z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Tag: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.969 13.281L13.281 22.5c.292.292.767.292 1.059 0l7.938-7.938c.292-.292.292-.767 0-1.059L13.281 4.5c-.14-.14-.331-.219-.531-.219H4.219C3.822 4.281 3.5 4.604 3.5 5v8.531c0 .2.079.391.219.531z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="8" r="1.125" fill="currentColor"/>
    </svg>
  ),
  Pointer: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 11.25v8.25h3.75v-4.5h8.25L4.5 3v8.25h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2.25v3.75M18 2.25l-6 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Message: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.253 7.5c3.034 0 5.695 2.027 6.503 4.952.808 2.926-.436 6.03-3.04 7.588-2.605 1.559-5.929 1.188-8.125-.905-2.196-2.093-2.725-5.395-1.292-8.071l-.765-2.602c-.077-.263-.004-.547.19-.741.194-.194.478-.267.741-.19l2.6.765c.968-.465 2.029-.734 3.118-.796z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12.375" cy="13.125" r="1.125" fill="currentColor"/>
      <circle cx="17.625" cy="13.125" r="1.125" fill="currentColor"/>
    </svg>
  ),
  Question: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 7.5v.75c0 1.449 1.343 2.625 3 2.625s3-1.176 3-2.625V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="16.875" r="1.125" fill="currentColor"/>
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9v-5.25c-2.071 0-3.75-1.679-3.75-3.75H12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15.75v5.25M5.753 7.125L3.305 12.971" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="13.5" r="3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="8.25" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="8.25" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.75 17.25c1.095-1.859 3.092-3 5.25-3s4.155 1.141 5.25 3M18 11.25c1.061 1.417 2.729 2.251 4.5 2.25M6 13.5c-1.771-.001-3.439-.834-4.5-2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Grid: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.25 10.5v6M11.25 7.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Robot: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5.25" width="18" height="15" rx="2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 1.5v3.75M6.75 9h2.25M15 9h2.25M6.75 13.5h10.5M10.125 13.5v3.75M13.875 13.5v3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="10.125" r="1.125" fill="currentColor"/>
      <circle cx="15" cy="10.125" r="1.125" fill="currentColor"/>
    </svg>
  ),
  Chart: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.75 5.25h6v6l-6-6zM2.25 8.25l16.5 9-3.75-3.75-9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  BarChart: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14.25" y="3.75" width="5.25" height="15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 12.75v6.75h4.5M3 19.5h18M9 8.25v11.25h5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  CloudIcon : () => (
    <svg
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="currentColor"
  >
    <path d="M11.473 9a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 14h8.5a2.5 2.5 0 1 0-.027-5z" />
    <path d="M14.544 9.772a3.506 3.506 0 0 0-2.225-1.676 5.502 5.502 0 0 0-6.337-4.002 4.002 4.002 0 0 1 7.392.91 2.5 2.5 0 0 1 1.17 4.769z" />
  </svg>
  ),
};

const features = [
  {
    icon: Icons.Robot,
    title: "Real-Time Infrastructure Monitoring",
    description: "Continuously tracks CPU utilization and system load in real time to understand current resource demand and detect inefficiencies instantly."
  },
  {
    icon: Icons.Chart,
    title: "AI-Based Load Forecasting",
    description: "Uses LSTM time-series forecasting to predict future CPU demand, enabling proactive scaling decisions before performance issues occur."
  },
  {
    icon: Icons.Users,
    title: "Intelligent Scaling Recommendations",
    description: "Automatically recommends SCALE UP, SCALE DOWN, or NO CHANGE based on predicted load and anomaly detection logic."
  },
  {
    icon: Icons.Target,
    title: "Dynamic Cloud Cost Engine",
    description: "Calculates real-time savings using provider-specific pricing models, instance count, and duration of scaled-down resources."
  },
  {
    icon: Icons.BarChart,
    title: "Multi-Provider Configuration Support",
    description: "Allows users to select AWS or GCP instance types, automatically applying realistic pricing and infrastructure constraints."
  },
  {
    icon: Icons.CloudIcon,
    title: "Live Savings & Efficiency Dashboard",
    description: "Displays scaling decisions, predicted load, scaled duration, and accumulated savings in an interactive, real-time dashboard."
  }
];


const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#03063d] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#03063d] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#03063d] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className=" z-100 w-full border-b fixed border-white/10 backdrop-blur-3xl">
        <nav className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-linear-to-br from-[#030f6a] to-blue-800 rounded-lg flex items-center justify-center">
                <Icons.CloudIcon />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-[#7484e9] to-blue-400 bg-clip-text text-transparent">
                Scalora
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors duration-200">About</a>
              <Link to="/AnalyzeCSV" className="px-6 py-2 bg-linear-to-r from-blue-700 to-blue-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500 transition-all duration-300 transform hover:scale-105">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-40 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-[#03063d] border border-[#282b67] rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Icons.CloudIcon />
            <span className="text-sm text-[#c4c8e7]">Powered by Advanced AI</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-linear-to-r from-white via-blue-200 to-blue-300 bg-clip-text text-transparent">
              Intelligent Cloud.
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-200 via-blue-300 to-blue-200 bg-clip-text text-transparent">
              Smarter Spend.
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Scalora AI is an intelligent cloud optimization engine that predicts infrastructure demand and autonomously reduces cloud spend
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/Analyze" className="group px-8 py-4 bg-linear-to-r from-[#2301ae] to-[#10026c] rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#4e77c9] transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
              Start Free Trial
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/Demo" className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg hover:bg-[#0124825b] transition-all duration-100 flex items-center space-x-2 backdrop-blur-sm">
              <Icons.Message />
              Demo
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to build, scale, and optimize your business with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>


      <section id='about' className="relative z-10 container mx-auto px-6 pb-40 py-20">
        <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-12 backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join Scalora to accelerate their growth with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/Analyze" className="px-8 py-4 bg-white text-purple-900 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </Link>
            <Link to="Demo" className="px-8 py-4 border border-white/30 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
              Demo
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Dashboard;
