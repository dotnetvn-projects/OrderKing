import { LoginLayoutComponent } from '../presentation/_layout/login-layout/login-layout.component';
import { MainLayoutComponent } from '../presentation/_layout/main-layout/main-layout.component';
import { LoginComponent } from '../presentation/main/login/login.component';
import { AuthGuard } from '../framework/framework.auth.guard';

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
            { path: 'nhan-vien', loadChildren: 'src/app/presentation/main/staff/staff.module#StaffModule' }
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
