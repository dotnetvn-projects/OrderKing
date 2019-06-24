import { ModelBase } from '../base.model';
import { ListModel } from '../list.model';
import { SysNotifyModel } from './sysnotify.model';

export class SysNotifyGroupModel extends ModelBase {
   DateGroup: string;
   SysNotifyList: Array<SysNotifyModel>;
}
