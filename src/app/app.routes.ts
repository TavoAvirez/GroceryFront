import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsManagementsComponent } from './pages/Products/products-manager/products-managements.component';
import { ProductsInventoryComponent } from './pages/Products/inventory-products/products-inventory.component';
import { PosComponent } from './pages/pos/pos/pos.component';



export const routes: Routes = [
    { path: '', component: DashboardComponent }, // Ruta por defecto
    { path: 'home', component: DashboardComponent },
    { path: 'products-management', component: ProductsManagementsComponent },
    { path: 'products-inventory', component: ProductsInventoryComponent },
    { path: 'pos', component: PosComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Ruta para manejar rutas no encontradas

];
