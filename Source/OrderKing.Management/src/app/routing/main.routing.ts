import { DashboardComponent } from '../presentation/maincomponents/dashboard/dashboard.component';

export const MainRoutes = [
    { path: 'dashboard', component: DashboardComponent},
    { path: 'danh-muc', loadChildren: '../presentation/components/category/category.module#CategoryModule' },
    { path: 'san-pham', loadChildren: '../presentation/components/product/product.module#ProductModule' },
    { path: '', component: DashboardComponent },
];
