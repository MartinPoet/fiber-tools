// web/src/components/SidebarLayout.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
        {/* Home‑Logo / Link */}
        <Link href="/" className="flex items-center mb-6">
        <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            priority
            className="mr-2"
          />
          <span className="text-xl font-semibold">FTTH Tools</span>
        </Link>

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
