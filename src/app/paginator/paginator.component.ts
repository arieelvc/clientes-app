import { Component, Input } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {

  @Input() paginador: any;
  paginas: number[];

  constructor() { }

  ngOnInit() {
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);
  }
}
