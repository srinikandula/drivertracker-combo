import { Component, OnInit } from '@angular/core';
import { HttpService } from '@app/shared/services/http.service';
import { ApiUrlsService } from '@app/shared/services/api-urls.service';
import { PaginationDirective } from '@app/shared/directives/pagination.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-slabs',
  templateUrl: './slabs.component.html',
  styleUrls: ['./slabs.component.scss'],
})
export class SlabsComponent implements OnInit {
  slabData: Array<any> = [];
  errors: Array<any> = [];
  queryObj: any = {
    page: 1,
    size: 50,
    pageSizes: [],
  };
  addSlabObj: any = {
    type: '',
    pricePerKM: 0,
    slab: '',
  };
  totalCount = 0;
  username: any = '';
  title: string = 'Add Slab';
  public slabId: any;

  constructor(
    private httpService: HttpService,
    private apiUrls: ApiUrlsService,
    private modalService: NgbModal
  ) {
    this.username = JSON.parse(
      localStorage.getItem('loggedUser') as string
    ).username;
  }

  ngOnInit(): void {
    this.getSlabs();
  }

  getSlabs() {
    this.httpService
      .getAll(this.apiUrls.getAllSlabs, this.queryObj)
      .subscribe((res: any) => {
        if (res) {
          this.slabData = res.result.data;
          this.totalCount = res.result.total;
          PaginationDirective.pagination(this.totalCount, this.queryObj);
        }
      });
  }

  openSlabModal(modal: any) {
    this.modalService.open(modal, {
      size: 'md',
    });
  }

  addSlab() {
    this.errors = [];
    if (
      !this.addSlabObj.type &&
      !this.addSlabObj.pricePerKM &&
      !this.addSlabObj.slab
    ) {
      this.errors.push('Please enter (*) fields..!');
    } else if (!this.addSlabObj.type) {
      this.errors.push('Please enter Type');
    } else if (!this.addSlabObj.pricePerKM) {
      this.errors.push('Please enter Price Per KM');
    } else if (!this.addSlabObj.slab) {
      this.errors.push('Please enter Slab');
    } else {
      this.errors = [];
      this.addSlabObj.username = this.username;
      if (this.slabId) {
        this.httpService
          .update(this.apiUrls.updateSlab + this.slabId, this.addSlabObj)
          .subscribe((res: any) => {
            if (res) {
              Swal.fire('Success', 'Slab Updated Successfully..!', 'success');
              this.modalService.dismissAll();
              this.ngOnInit();
            }
          });
      } else {
        this.httpService
          .getAll(this.apiUrls.saveSlab, this.addSlabObj)
          .subscribe((res: any) => {
            if (res) {
              Swal.fire('Success', 'Slab added Successfully..!', 'success');
              this.modalService.dismissAll();
              this.ngOnInit();
            }
          });
      }
    }
  }

  editSlab(slab: any, modal: any) {
    if (slab) {
      this.slabId = slab._id;
      this.title = 'Edit Slab';
      this.modalService.open(modal, { size: 'md' });
      this.addSlabObj = slab;
    }
  }

  handlePageSizeChange(size: number) {
    this.queryObj.size = size;
    this.queryObj.page = 1;
    this.getSlabs();
  }

  changePage(event: number) {
    this.queryObj.page = event;
    this.getSlabs();
  }
}
