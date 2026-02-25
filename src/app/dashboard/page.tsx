import SummaryCards from '@/components/dashboard/SummaryCards';
import HealthScore from '@/components/dashboard/HealthScore';
import ExpensePieChart from '@/components/dashboard/ExpensePieChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

export default function DashboardPage() {
    return (
        <div className="space-y-12 pb-20">
            <SummaryCards />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-12">
                    <HealthScore />
                    <RecentTransactions />
                </div>
                <div>
                    <ExpensePieChart />
                </div>
            </div>
        </div>
    );
}
