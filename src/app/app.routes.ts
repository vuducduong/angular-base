import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppNetworkGuard } from "./app-network.guard";
import { AppAuthGuard } from "./app-auth.guard";
import { AppNoAuthGuard } from "./app-no-auth.guard";
import { AppRoleGuard } from './app-role.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./main/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [AppNetworkGuard, AppNoAuthGuard],
  },
  {
    path: "dashboard",
    loadChildren: () => import("./main/dashboard/dashboard.module").then((m) => m.DashboardModule),
    canActivate: [AppNetworkGuard, AppAuthGuard],
  },
  {
    path: "not-found",
    loadChildren: () =>
      import("./main/error/404/error-404.module").then((m) => m.Error404Module),
  },
  {
    path: "authentication",
    loadChildren: () =>
      import("./main/error/401/error-401.module").then((m) => m.Error401Module),
  },
  {
    path: "forbidden",
    loadChildren: () =>
      import("./main/error/403/error-403.module").then((m) => m.Error403Module),
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];