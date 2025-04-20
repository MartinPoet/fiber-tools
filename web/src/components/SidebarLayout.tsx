// web/src/components/SidebarLayout.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'CAPEX', href: '/capex' },
  { label: 'Restoration', href: '/restoration' },
  { label: 'Municipality', href: '/municipality' },
  { label: 'Competitors', href: '/competitors' },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-6">FTTH Tools</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded ${
                  active ? 'bg-teal-500 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-white overflow-auto">{children}</main>
    </div>
  );
}
