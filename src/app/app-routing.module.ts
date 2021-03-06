import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './product/list/list.component';

const routes: Routes = [
  {
    path:'',
    redirectTo :'/products',
    pathMatch:'full'
  },
  {
    path:'products',
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
