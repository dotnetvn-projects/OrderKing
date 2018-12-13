import { StaffComponent } from '../presentation/staff/index/staff.component';
import { CreateStaffComponent } from '../presentation/staff/create/staff.create.component';

export const StaffRoutes = [
    { path: '', component: StaffComponent },
    { path: 'tao-moi', component: CreateStaffComponent }
];
