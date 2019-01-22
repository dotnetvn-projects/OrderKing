import { OrderComponent } from '../presentation/main/order/index/order.component';
import { OrderDetailComponent } from '../presentation/main/order/detail/order.detail.component';
import { PrintOrderComponent } from '../presentation/main/order/print/order.print.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const OrderRoutes = [
    { path: '', component: OrderComponent},
    { path: 'chi-tiet/:id', component: OrderDetailComponent, canActivate: [AuthGuard]},
    { path: 'in-don-hang/:id', component: PrintOrderComponent, canActivate: [AuthGuard]},
    { path: 'in-don-hang/tao-pdf/:id', component: PrintOrderComponent, canActivate: [AuthGuard]}
];
