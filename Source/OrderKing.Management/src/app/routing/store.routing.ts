import { StoreComponent } from '../presentation/main/store/index/store.component';
import { AuthGuard } from '../framework/framework.auth.guard';
import { StoreActionComponent } from '../presentation/main/store/action/store.action.component';

export const StoreRoutes = [
    { path: '', component: StoreComponent },
    { path: 'chinh-sua/:id', component: StoreActionComponent, canActivate: [AuthGuard] }
];
