import { CategoryComponent } from '../presentation/main/category/index/category.component';
import { CategoryActionComponent } from '../presentation/main/category/action/category.action.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const CategoryRoutes = [
    { path: '', component: CategoryComponent},
    { path: 'tao-moi', component: CategoryActionComponent, canActivate: [AuthGuard] },
    { path: 'chinh-sua/:id', component: CategoryActionComponent, canActivate: [AuthGuard] }
];
