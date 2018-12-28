import { StaffComponent } from '../presentation/main/staff/index/staff.component';
import { StaffActionComponent } from '../presentation/main/staff/action/staff.action.component';
import { AuthGuard } from '../framework/framework.auth.guard';

export const StaffRoutes = [
    { path: '', component: StaffComponent, canActivate: [AuthGuard] },
    { path: 'tao-moi', component: StaffActionComponent, canActivate: [AuthGuard] },
    { path: 'chinh-sua/:id', component: StaffActionComponent, canActivate: [AuthGuard] }
];
