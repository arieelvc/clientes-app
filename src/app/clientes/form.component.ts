import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente()
  regiones: Region[];
  public titulo: string = "crear Cliente"

  public errores: string[];

  constructor(public clienteService: ClienteService,
    public router: Router,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }
  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    });
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  create(): void {
    console.log(this.cliente);
    // console.log("Clicked!")
    this.clienteService.create(this.cliente)
      .subscribe(cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo Cliente', `El Cliente ${cliente.nombre} ha sido creado con exito!`, 'success')
      },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Codigo del error desde el backend:' + err.status);
          console.error(err.error.errors);
        }
      );
  }

  update(): void {
    console.log(this.cliente);
    this.clienteService.update(this.cliente)
      .subscribe(json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Codigo del error desde el backend:' + err.status);
          console.error(err.error.errors);
        }

      )
  }
  compararRegion(o1: Region, o2: Region) {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
