import { StaffComponent } from '../presentation/staff/index/staff.component';
import { StaffActionComponent } from '../presentation/staff/action/staff.action.component';

export const StaffRoutes = [
    { path: '', component: StaffComponent },
    { path: 'tao-moi', component: StaffActionComponent },
    { path: 'chinh-sua/:id', component: StaffActionComponent }
];
