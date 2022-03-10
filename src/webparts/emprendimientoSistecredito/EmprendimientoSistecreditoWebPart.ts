import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'EmprendimientoSistecreditoWebPartStrings';
import EmprendimientoSistecredito from './components/EmprendimientoSistecredito';
import { IEmprendimientoSistecreditoProps } from './components/IEmprendimientoSistecreditoProps';

export interface IEmprendimientoSistecreditoWebPartProps {
  description: string;
  siteURL:string;
}

export default class EmprendimientoSistecreditoWebPart extends BaseClientSideWebPart<IEmprendimientoSistecreditoWebPartProps> {

  protected onInit():Promise<void>{
    return new Promise<void>((resolve,_reject)=>{

      this.properties.siteURL="https://sistecredito.sharepoint.com/sites/Intranet";
      resolve(undefined);

    });
  }




  public render(): void {
    const element: React.ReactElement<IEmprendimientoSistecreditoProps > = React.createElement(
      EmprendimientoSistecredito,
      {
        description: this.properties.description,
        context:this.context,
        siteURL:this.properties.siteURL,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
