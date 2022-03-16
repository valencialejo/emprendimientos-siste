import { IEmprendimiento } from "./IEmprendimiento";
import { IDropdownOption } from '@fluentui/react';

export interface IEmprendimientoState{
    emprendimiento:IEmprendimiento;
    emprendimientos:Array<IEmprendimiento>;
    categorias_:Array<string>;
    categorias:IDropdownOption[];
    busqueda_:string;
    busqueda:string;
    filtroCategoria_:Boolean;
    filtroCategoria:Boolean;
}