// web/src/app/dashboard/page.tsx
'use client'; // falls du client‑seitige Hooks nutzt

import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';


export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div className="text-2xl font-bold mb-4">Dashboard</div>
      <p className="text-gray-600">
        Hier findest du eine Übersicht deiner Projekte und letzten Aktivitäten.
      </p>
    </SidebarLayout>
  );
}
