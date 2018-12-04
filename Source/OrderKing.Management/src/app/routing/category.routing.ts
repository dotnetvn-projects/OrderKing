import { CategoryComponent } from '../presentation/components/category/index/category.component';
import { CreateCategoryComponent } from '../presentation/components/category/create/category.create.component';
import { UpdateCategoryComponent } from '../presentation/components/category/update/category.update.component';

export const CategoryRoutes = [
    { path: '', component: CategoryComponent },
    { path: 'them-moi', component: CreateCategoryComponent },
    { path: 'chinh-sua/:id', component: UpdateCategoryComponent }
];
