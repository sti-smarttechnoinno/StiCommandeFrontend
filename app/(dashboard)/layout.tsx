import { Providers } from '@/components/layout/providers';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardLayout>{children}</DashboardLayout>
    </Providers>
  );
}
