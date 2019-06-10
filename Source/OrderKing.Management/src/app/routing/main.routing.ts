import { LoginLayoutComponent } from '../presentation/_layout/login-layout/login-layout.component';
import { MainLayoutComponent } from '../presentation/_layout/main-layout/main-layout.component';
import { LoginComponent } from '../presentation/main/login/login.component';
import { AuthGuard } from '../framework/framework.auth.guard';
import { PrintLayoutComponent } from '../presentation/_layout/print-layout/print-layout.component';

export const MainRoutes = [
    // main routes
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dashboard', loadChildren: 'src/app/presentation/main/dashboard/dashboard.module#DashboardModule'},
            { path: '', loadChildren: 'src/app/presentation/main/dashboard/dashboard.module#DashboardModule' },
            { path: 'danh-muc', loadChildren: 'src/app/presentation/main/category/category.module#CategoryModule' },
            { path: 'mat-hang', loadChildren: 'src/app/presentation/main/product/product.module#ProductModule' },
            { path: 'nhan-vien', loadChildren: 'src/app/presentation/main/staff/staff.module#StaffModule' },
            { path: 'cua-hang', loadChildren: 'src/app/presentation/main/store/store.module#StoreModule' },
            { path: 'don-hang', loadChildren: 'src/app/presentation/main/order/order.module#OrderModule' },
            { path: 'don-hang/:type', loadChildren: 'src/app/presentation/main/order/order.module#OrderModule' },
            { path: 'bao-cao', loadChildren: 'src/app/presentation/main/report/report.module#ReportModule' },
            { path: 'log', loadChildren: 'src/app/presentation/main/audit/audit.module#AuditModule' }
        ],
        canActivate: [AuthGuard]
    },
    {
      path: '',
      component: PrintLayoutComponent,
      children: [
          { path: 'printer', loadChildren: 'src/app/presentation/main/order/order.module#OrderModule' }
      ],
      canActivate: [AuthGuard]
  },
    // login route
    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            { path: 'dang-nhap', component: LoginComponent}
        ]
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
