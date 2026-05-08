"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileWarning,
  MapPinned,
  Bell,
  Settings,
} from "lucide-react";

const links = [
  {
    title: "Dashboard",
    href: "/citizen",
    icon: LayoutDashboard,
  },
  {
    title: "Report Issue",
    href: "/citizen/report",
    icon: FileWarning,
  },
  {
    title: "Live Map",
    href: "/map",
    icon: MapPinned,
  },
  {
    title: "Notifications",
    href: "#",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#0d1526] border-r border-white/10 p-6">

      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-blue-400">
          CityPulse AI
        </h1>

        <p className="text-slate-400 mt-2 text-sm">
          Smart Civic Platform
        </p>
      </div>

      {/* Links */}
      <nav className="space-y-3">

        {links.map((link, index) => {
          const Icon = link.icon;

          return (
            <Link
              key={index}
              href={link.href}
              className="flex items-center gap-4 p-4 rounded-2xl text-slate-300 hover:bg-blue-500/10 hover:text-white transition"
            >
              <Icon size={22} />
              <span>{link.title}</span>
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}