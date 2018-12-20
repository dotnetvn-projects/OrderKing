import { CategoryComponent } from '../presentation/category/index/category.component';
import { CreateCategoryComponent } from '../presentation/category/create/category.create.component';
import { UpdateCategoryComponent } from '../presentation/category/update/category.update.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const CategoryRoutes = [
    { path: '', component: CategoryComponent},
    { path: 'tao-moi', component: CreateCategoryComponent, canActivate: [AuthGuard] },
    { path: 'chinh-sua/:id', component: UpdateCategoryComponent, canActivate: [AuthGuard] }
];
