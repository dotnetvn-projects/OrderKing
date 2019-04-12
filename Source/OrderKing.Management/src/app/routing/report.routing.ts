import { ReportRevenueComponent } from '../presentation/main/report/revenue/report.revenue.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const ReportRoutes = [
    { path: 'doanh-thu-ban-hang', component: ReportRevenueComponent , canActivate: [AuthGuard] }
];
