import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@app/components/layout/layout.component';
import { FareconfigComponent } from '@app/components/layout/fareconfig/fareconfig.component';
import { FarelistComponent } from '@app/components/layout/farelist/farelist.component';
import { SlabsComponent } from '@app/components/layout/slabs/slabs.component';
import { LogsComponent } from '@app/components/layout/logs/logs.component';
import { AuthGuard } from '@app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'layout/fareConfig',
        canActivate: [AuthGuard],
        component: FareconfigComponent,
      },
      {
        path: 'layout/fareList',
        canActivate: [AuthGuard],
        component: FarelistComponent,
      },
      {
        path: 'layout/slab',
        canActivate: [AuthGuard],
        component: SlabsComponent,
      },
      {
        path: 'layout/logs',
        canActivate: [AuthGuard],
        component: LogsComponent,
      },
      {
        path: '',
        canActivate: [AuthGuard],
        component: FarelistComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
