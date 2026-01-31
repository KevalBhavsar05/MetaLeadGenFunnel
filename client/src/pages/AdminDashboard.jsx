import React, { useState, useCallback } from "react";
import Sidebar from "@/components/common/Sidebar";
import Meeting from "./Meeting";
import Overview from "./Overview";
import SlotConfig from "./SlotConfig";
import { BarChart3, Menu } from "lucide-react";

const MetaFlowDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleSidebarCollapse = useCallback(() => setIsSidebarCollapsed((p) => !p), []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "meetings":
        return <Meeting />;
      case "slots":
        return <SlotConfig />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={closeMobileMenu}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Mobile header: logo + hamburger */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 px-4 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BarChart3 size={18} className="text-white" />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">
            Meta<span className="text-blue-600">Flow</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* MAIN CONTENT: offset for mobile header + desktop sidebar */}
      <main className="flex-1 min-h-screen overflow-x-hidden pt-16 lg:pt-0">
        {renderContent()}
      </main>
    </div>
  );
};

export default MetaFlowDashboard;