import { ReportRevenueComponent } from '../presentation/main/report/revenue/report.revenue.component';
import { ReportProductComponent } from '../presentation/main/report/product/report.product.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const ReportRoutes = [
    { path: 'doanh-thu-ban-hang', component: ReportRevenueComponent , canActivate: [AuthGuard] },
    { path: 'mat-hang-ban-chay', component: ReportProductComponent , canActivate: [AuthGuard] }
];
