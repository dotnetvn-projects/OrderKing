import { NgModule } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { ProductItemComponent } from './../product-item/product-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        ProductItemComponent
    ],
    imports: [
        CoreModule,
        FontAwesomeModule
    ],
    exports: [
        ProductItemComponent
    ]
})
export class ProductHorizontalItemModule { }
