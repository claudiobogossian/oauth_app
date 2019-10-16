import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { MyProfileComponent } from './users/my-profile/my-profile.component';
import { ListAppsComponent } from './applications/list-apps/list-apps.component';


const routes: Routes = [
  { path: '', redirectTo: '/admin/my', pathMatch: 'full' },
  { path: 'users', component: ListUsersComponent },
  { path: 'apps', component: ListAppsComponent },
  { path: 'users/create', component: CreateUserComponent },
  { path: 'my', component: MyProfileComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
