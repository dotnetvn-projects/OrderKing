import { LoginLayoutComponent } from '../presentation/_layout/login-layout/login-layout.component';
import { MainLayoutComponent } from '../presentation/_layout/main-layout/main-layout.component';

export const MainRoutes = [
    // main routes
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dashboard', loadChildren: '../presentation/dashboard/dashboard.module#DashboardModule'},
            { path: '', loadChildren: '../presentation/dashboard/dashboard.module#DashboardModule' },
            { path: 'danh-muc', loadChildren: '../presentation/category/category.module#CategoryModule' },
            { path: 'san-pham', loadChildren: '../presentation/product/product.module#ProductModule' }
        ]
    },
    // login route
    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            { path: 'dang-nhap', loadChildren: '../presentation/login/login.module#LoginModule' }
        ]
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
