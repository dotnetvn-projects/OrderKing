import { NgModule } from '@angular/core';
import { CoreModule } from '../../../../core/core.module';
import { ProductItemComponent } from './../product-item/product-item.component';

@NgModule({
    declarations: [
        ProductItemComponent
    ],
    imports: [
        CoreModule
    ],
    exports: [
        ProductItemComponent
    ]
})
export class ProductHorizontalItemModule { }
