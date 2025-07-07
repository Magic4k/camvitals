import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function AdminPanelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">This is /admin/panel</h1>
    </div>
  );
} 