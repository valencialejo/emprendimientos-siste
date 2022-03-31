import * as React from 'react';
import styles from './EmprendimientoSistecredito.module.scss';
import { IEmprendimientoSistecreditoProps } from './IEmprendimientoSistecreditoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IEmprendimientoState } from './IEmprendimientoState';
import { MSGraphClient } from '@microsoft/sp-http';
import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { IEmprendimiento } from './IEmprendimiento';
import { DefaultButton, Button, FocusZone, List } from 'office-ui-fabric-react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import '@popperjs/core';
import { Dropdown, Modal, IDropdownOption, DropdownMenuItemType } from '@fluentui/react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { DetailsModal } from './DetailsModal';

const options: IDropdownOption[] = [
  { key: 'Vestuario', text: 'Vestuario', },
  { key: 'Calzado', text: 'Calzado' },
  { key: 'Bolsos', text: 'Bolsos' },
  { key: 'Colchones', text: 'Colchones' },
  { key: 'Autopartes carros y motos', text: 'Autopartes carros y motos' },
  { key: 'Tecnología', text: 'Tecnología' },
  { key: 'Ropa Interior', text: 'Ropa Interior' },
  { key: 'Variedades', text: 'Variedades' },
  { key: 'Hogar', text: 'Hogar' },
  { key: 'Telas', text: 'Telas' },
  { key: 'Jugueteria', text: 'Jugueteria' },
  { key: 'Opticas', text: 'Opticas' },
  { key: 'Relojeria y/o Joyeria', text: 'Relojeria y/o Joyeria' },
  { key: 'Articulos Deportivos', text: 'Articulos Deportivos' },
  { key: 'Telefonia movil', text: 'Telefonia movil' },
  { key: 'Papeleria y Variedades', text: 'Papeleria y Variedades' },
  { key: 'Perfumeria', text: 'Perfumeria' },
  { key: 'Llantas', text: 'Llantas' },
  { key: 'Manualidades', text: 'Manualidades' },
  { key: 'Textiles', text: 'Textiles' },
  { key: 'Estetica', text: 'Estetica' },
  { key: 'Enseñanza Automovilistica', text: 'Enseñanza Automovilistica' },
  { key: 'Ferreteria', text: 'Ferreteria' },
  { key: 'Odontologia', text: 'Odontologia' },
  { key: 'Reposteria', text: 'Reposteria' },
  { key: 'Artículos Religiosos', text: 'Artículos Religiosos' },
  { key: 'Drogueria', text: 'Drogueria' },
  { key: 'Iluminacion', text: 'Iluminacion' },
  { key: 'Muebles', text: 'Muebles' },
  { key: 'Soat y accesorios', text: 'Soat y accesorios' },
  { key: 'Bebé', text: 'Bebé' },
  { key: 'Ingenieria', text: 'Ingenieria' },
  { key: 'Accesorios', text: 'Accesorios' },
  { key: 'Cristaleria', text: 'Cristaleria' },
  { key: 'Dama', text: 'Dama' },
  { key: 'Deportivo', text: 'Deportivo' },
  { key: 'Fajas', text: 'Fajas' },
  { key: 'Infantil', text: 'Infantil' },
  { key: 'Pijamas', text: 'Pijamas' },
  { key: 'Uniformes', text: 'Uniformes' },
  { key: 'Juvenil', text: 'Juvenil' },
  { key: 'Cascos', text: 'Cascos' },
  { key: 'Viajes', text: 'Viajes' },
  { key: 'Educación', text: 'Educación' },
  { key: 'Veterinaria', text: 'Veterinaria' },
  { key: 'Tatuajes y Accesorios', text: 'Tatuajes y Accesorios' },
  { key: 'Terapeutica', text: 'Terapeutica' },
  { key: 'Restaurante', text: 'Restaurante' },
  { key: 'Publicidad', text: 'Publicidad' },
  { key: 'Electrodomésticos', text: 'Electrodomésticos' },
  { key: 'Producción musical', text: 'Producción musical' },
  { key: 'Alimentos', text: 'Alimentos' },
  { key: 'Servicios', text: 'Servicios' },
  { key: 'Supermercados', text: 'Supermercados' },

];


export default class EmprendimientoSistecredito extends React.Component<IEmprendimientoSistecreditoProps, IEmprendimientoState> {

  constructor(props: IEmprendimientoSistecreditoProps, state: IEmprendimientoState) {
    super(props);

    this.state = {
      emprendimiento: undefined,
      emprendimientos: [],
      categorias_: [],
      categorias: [{ key: "Mostrar todo", text: "Mostrar todo", itemType: DropdownMenuItemType.Normal }, { key: "divisor-1", text: '-', itemType: DropdownMenuItemType.Divider }],
      busqueda_: '',
      busqueda: 'Mostrar todo',
      filtroCategoria_: true,
      filtroCategoria: true,
      detalles:false,
    };

    this.handler=this.handler.bind(this);
    this.buttonClick=this.buttonClick.bind(this);
  }

  handler(){
    this.setState({
      detalles:false
    })
  }

  private buttonClick(e,id){
    e.preventDefault();
    this.setState({
      detalles:true,
      id:id
    })
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
          Logo: item.Logo,
          Logo_url: item.Logo_url
        };
        this.setOptions(item.Categor_x00ed_a, item.Estado, item.Estadopublicaci_x00f3_n);
        this.setState({ emprendimiento: emprendimiento });
        Emprendimientos.push(this.state.emprendimiento);
      });

      this.setState({ emprendimientos: Emprendimientos });

      // console.log(this.state.emprendimientos);
    });
  }

  public onClick = (): void => {
    this.setState({ busqueda: this.state.busqueda_ });
    this.setState({ filtroCategoria: this.state.filtroCategoria_ });
  }

  public onDropdownChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    this.setState({ busqueda_: item.key as string });

    if (item.key as string == "Mostrar todo") {
      this.setState({ filtroCategoria_: true });
    }
    else {
      this.setState({ filtroCategoria_: false });
    }

  }

  public setOptions(Categoria: string, Estado: string, Estadopublicaci_x00f3_n: string,): void {
    if (!this.state.categorias_.includes(Categoria) && Estado == "Aprobado" && Estadopublicaci_x00f3_n == "Activo") {
      this.state.categorias_.push(Categoria);
      this.state.categorias.push({ key: Categoria, text: Categoria },);
    }
  }

  public render(): React.ReactElement<IEmprendimientoSistecreditoProps> {
    console.log(this.state.categorias);
    console.log(this.props.siteURL);
    const items = <div className={`row ${styles['emprendimientos__fix-margin']}`}>{
      this.state.emprendimientos.filter(emprendimiento => emprendimiento.Estado == "Aprobado" && emprendimiento.Estadopublicaci_x00f3_n == "Activo" && (this.state.filtroCategoria || emprendimiento.Categor_x00ed_a == this.state.busqueda)).map(e => (
        <div className={`col ${styles['emprendimientos__card-container']} ${styles['emprendimientos__fix-padding']}`} onClick={()=>console.log('Bien')}>
          <div className={styles.emprendimientos__contenido}>
            <span className={`${styles['emprendimientos__text--lg']} ${styles['emprendimientos__text--bd']} ${styles['emprendimientos__text--RedHat']}`}>{e.Nombredelemprendimiento}</span><br />
            <span className={`${styles['emprendimientos__text--xs']} ${styles['emprendimientos__text--RedHat']}`}>{e.Categor_x00ed_a}</span>
          </div>
          <img src={e.Logo_url} className={styles.emprendimientos__logo} />
        </div>
      ))
    }</div>;

    return (
      <div className={styles.emprendimientos}>
        <h1 className={styles.emprendimientos__title}>¡Es posible crecer juntos!</h1>
        <p>En este espacio encontrarás los emprendimientos de tus compañeros. Échale una mirada y cuando necesites algún producto o servicio apóyalos con tu compra:</p>
        <div className={`container-fluid ${styles.emprendimientos__buscador}`}>
          <div className={`row`}>
            <div className={`col-6 ${styles['emprendimientos__fix-padding']}`}>
              <Dropdown
                placeholder="Selecciona una categoría"
                selectedKey={this.state.busqueda_}
                label="Categorías:"
                options={this.state.categorias}
                onChange={this.onDropdownChange}
                styles={{
                  label: `${styles['emprendimientos__text--RedHat']} ${styles['emprendimientos__text--sm']} ${styles['emprendimientos__text--normal']}`,
                }}
              />
            </div>
            <div className={`col-6 ${styles['emprendimientos__fix-padding']}`}>
              <button onClick={this.onClick} className={`${styles.emprendimientos__boton} ${styles["emprendimientos__text--sm"]}`}>Buscar</button>
            </div>
          </div>
        </div>

        <div className={`container-fluid ${styles.emprendimientos__main} ${styles['emprendimientos__fix-padding']}`}>
          {items}
        </div>
      </div>
    );
  }
}




