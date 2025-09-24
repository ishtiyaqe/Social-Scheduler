'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "Create Post", href: "/post" },
    { name: "Customize", href: "/customize" },
    { name: "Scheduled", href: "/scheduled" },
  ];

  const handleDashboardClick = (e, href) => {
    e.preventDefault();
    router.push("/"); 
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Social Scheduler</h1>
      <nav className="space-x-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <span
              key={link.href}
              className={`${
                isActive
                  ? "text-gray-300 cursor-not-allowed font-bold"
                  : "hover:underline cursor-pointer"
              }`}
              onClick={(e) =>
                isActive
                  ? e.preventDefault()
                  : link.name === "Dashboard"
                  ? handleDashboardClick(e, link.href)
                  : router.push(link.href)
              }
            >
              {link.name}
            </span>
          );
        })}
      </nav>
    </header>
  );
}
