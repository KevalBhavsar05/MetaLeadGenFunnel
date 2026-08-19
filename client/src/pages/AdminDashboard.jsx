import React, { useCallback, useState } from "react";
import Sidebar from "@/components/common/Sidebar";
import Meeting from "./Meeting";
import Overview from "./Overview";
import SlotConfig from "./SlotConfig";
import { Menu, TrendingUp } from "lucide-react";
import Users from "@/components/common/Users";

const MetaFlowDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleSidebarCollapse = useCallback(
    () => setIsSidebarCollapsed((p) => !p),
    [],
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "meetings":
        return <Meeting />;
      case "users":
        return <Users />;
      case "slots":
        return <SlotConfig />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={closeMobileMenu}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <TrendingUp size={18} />
          </div>
          <span className="text-lg font-black tracking-tight">
            TalkWith<span className="text-blue-600">Kartik</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>
      </header>

      <main className="min-h-screen flex-1 overflow-x-hidden pt-16 lg:pt-0">
        {renderContent()}
      </main>
    </div>
  );
};

export default MetaFlowDashboard;
