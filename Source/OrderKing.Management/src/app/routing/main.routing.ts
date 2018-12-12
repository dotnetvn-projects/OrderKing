import { LoginLayoutComponent } from '../presentation/_layout/login-layout/login-layout.component';
import { MainLayoutComponent } from '../presentation/_layout/main-layout/main-layout.component';
import { LoginComponent } from '../presentation/login/login.component';

export const MainRoutes = [
    // main routes
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dashboard', loadChildren: 'src/app/presentation/dashboard/dashboard.module#DashboardModule'},
            { path: '', loadChildren: 'src/app/presentation/dashboard/dashboard.module#DashboardModule' },
            { path: 'danh-muc', loadChildren: 'src/app/presentation/category/category.module#CategoryModule' },
            { path: 'san-pham', loadChildren: 'src/app/presentation/product/product.module#ProductModule' },
            { path: 'nhan-vien', loadChildren: 'src/app/presentation/staff/staff.module#StaffModule' }
        ]
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
