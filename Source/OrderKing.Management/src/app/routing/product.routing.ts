import { ProductComponent } from '../presentation/main/product/index/product.component';
import { ProductActionComponent } from '../presentation/main/product/action/product.action.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const ProductRoutes = [
    { path: '', component: ProductComponent },
    { path: 'tao-moi', component: ProductActionComponent, canActivate: [AuthGuard] },
    { path: 'chinh-sua/:id', component: ProductActionComponent, canActivate: [AuthGuard] }
];
