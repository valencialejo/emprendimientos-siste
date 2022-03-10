import * as React from 'react';
import styles from './EmprendimientoSistecredito.module.scss';
import { IEmprendimientoSistecreditoProps } from './IEmprendimientoSistecreditoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IEmprendimientoState } from './IEmprendimientoState';
import { MSGraphClient } from '@microsoft/sp-http';
import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IEmprendimiento } from './IEmprendimiento';
import { FocusZone, List } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.css";
// import Card from '@mui/material/Card';
// import { CardContent } from '@mui/material';


export default class EmprendimientoSistecredito extends React.Component<IEmprendimientoSistecreditoProps, IEmprendimientoState> {

  constructor(props: IEmprendimientoSistecreditoProps, state: IEmprendimientoState) {
    super(props);

    this.state = {
      emprendimiento: undefined,
      emprendimientos: [],
    };
  }

  public componentDidMount(): void {
    this.bindUserDetails();
  }

  public fetchUserDetailsSPList(list: string, filter: string): Promise<IEmprendimiento[]> {

    const url: string = this.props.siteURL + `/_api/web/lists/getbytitle('${list}')/items?$top=1000`;
    console.log(url);
    return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then(response => {
        return response.json();
      })
      .then(json => {
        return json.value;
      }) as Promise<IEmprendimiento[]>;
  }

  public bindUserDetails(): void {
    this.fetchUserDetailsSPList('Emprendimientos', 'NA').then(response => {

      var Emprendimientos: Array<IEmprendimiento> = new Array<IEmprendimiento>();
      response.map(item => {
        let emprendimiento: IEmprendimiento = {
          Nombredelemprendimiento: item.Nombredelemprendimiento,
          Nombrecompleto: item.Nombrecompleto,
          Estado: item.Estado,
          Estadopublicaci_x00f3_n: item.Estadopublicaci_x00f3_n,
          Categor_x00ed_a: item.Categor_x00ed_a,
          Descripci_x00f3_n: item.Descripci_x00f3_n,
          Contacto: item.Contacto,
          Facebook: item.Facebook,
          Instagram: item.Instagram,
          Whatsapp: item.Whatsapp,
          Logo: item.Logo
        };

        this.setState({ emprendimiento: emprendimiento });
        Emprendimientos.push(this.state.emprendimiento);
      });

      this.setState({ emprendimientos: Emprendimientos });
      // console.log(this.state.emprendimientos);
    });
  }

  public render(): React.ReactElement<IEmprendimientoSistecreditoProps> {
    console.log(this.state.emprendimientos);

    const items = <div className={`row`}>{
      this.state.emprendimientos.filter(emprendimiento => emprendimiento.Estado == "Aprobado" && emprendimiento.Estadopublicaci_x00f3_n == "Activo").map(e => (
        <div className={`col ${styles['emprendimientos__card-container']}`}>
          <p>{e.Nombredelemprendimiento} por {e.Nombrecompleto}</p>
        </div>
      ))
    }</div>;

    console.log(items);

    return (
      <div className={styles.emprendimientos}>
        <h1>Emprendimientos</h1>
        <div className="container-fluid">
          {items}
        </div>
      </div>
    );
  }
}




