import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileRoutes } from '../../../routing/profile.routing';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { DirectiveModule } from '../../_directives/directive.module';
import { PipeModule } from '../../_pipes/pipe.module';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    RouterModule.forChild(ProfileRoutes),
    UiComponentModule,
    CommonModule, FormsModule,
    DirectiveModule,
    PipeModule
  ],
  providers: [],
  bootstrap: [ProfileComponent]
})
export class ProfileModule { }
