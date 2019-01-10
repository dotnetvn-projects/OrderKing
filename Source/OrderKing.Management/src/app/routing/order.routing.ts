import { OrderComponent } from '../presentation/main/order/index/order.component';
import { OrderDetailComponent } from '../presentation/main/order/detail/order.detail.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const OrderRoutes = [
    { path: '', component: OrderComponent},
    { path: 'chi-tiet/:id', component: OrderDetailComponent, canActivate: [AuthGuard]}
];
