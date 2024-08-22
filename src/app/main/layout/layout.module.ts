import { IconModule } from './../../core/libraries/icon/icon.module';
import { PipeModule } from './../../core/helpers/pipe/pipe.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import Form, Flex
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import Material
// Import Components
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipeModule,
    IconModule,
    ToolbarModule,
    MenuModule,
    MenubarModule,
    ButtonModule,
    PanelMenuModule,
    SidebarModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }
