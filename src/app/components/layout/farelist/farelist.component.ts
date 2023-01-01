import {Component, OnInit} from '@angular/core';
import {HttpService} from '@app/shared/services/http.service';
import {ApiUrlsService} from '@app/shared/services/api-urls.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaginationDirective} from '@app/shared/directives/pagination.directive';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-farelist',
    templateUrl: './farelist.component.html',
    styleUrls: ['./farelist.component.scss'],
})
export class FarelistComponent implements OnInit {
    routesData: Array<any> = [];
    slabs: Array<any> = [];
    errors: Array<any> = [];
    queryObj: any = {
        page: 1,
        size: 50,
        pageSizes: [],
    };
    addRouteObj: any = {
        sourcecity: '',
        destinationcity: '',
        distance: '',
        slab: '',
    };
    updateRouteObj: any = {
        sourcecity: '',
        destinationcity: '',
        distance: '',
        slab: '',
        NON_AC_SEATER: '',
        AC_SEATER: '',
        NON_AC_SLEEPER: "",
        AC_SLEEPER: '',
        MULTI_SEATER: '',
        MULTI_SLEEPER: '',
        skipcalculate: Boolean
    };
    totalCount = 0;
    public error: string = '';
    public username: string = '';
    skipcalculate: any = false;
    public routeId: any;


    constructor(
        private httpService: HttpService,
        private apiUrls: ApiUrlsService,
        private modalService: NgbModal
    ) {
        this.username = JSON.parse(localStorage.getItem('loggedUser') as string).username;
    }

    ngOnInit(): void {
        this.getAllRouteConfigs();
        this.getAllSlabs();
    }

    editRouteConfig = (routeData: any, modal: any) => {
        this.errors = [];
        this.updateRouteObj = routeData;
        this.routeId = routeData._id;
        this.showModal(modal);
    };

    getAllRouteConfigs = () => {
        this.httpService
            .getAll(this.apiUrls.getAllRoutes, this.queryObj)
            .subscribe((res: any) => {
                if (res) {
                    this.routesData = res.result.data;
                    this.totalCount = res.result.total;
                    PaginationDirective.pagination(this.totalCount, this.queryObj);
                }
            });
    };

    getAllSlabs = () => {
        this.httpService.get(this.apiUrls.getSlabs).subscribe((res: any) => {
            if (res) {
                for (const a of res.data) {
                    this.slabs.push(a.slab);
                    this.slabs = Array.from(new Set(this.slabs));
                }
            }
        });
    };

    addRoute = (modal: any) => {
        this.showModal(modal);
    };

    saveRoute() {
        if (!this.routeId) {
            for (var key of Object.keys(this.addRouteObj)) {
                if (!this.addRouteObj[key]) {
                    this.errors = [];
                    this.errors.push('Please enter (*) Fields');
                }
            }
            this.addRouteObj.username = this.username;
            this.httpService
                .getAll(this.apiUrls.saveRoute, [this.addRouteObj])
                .subscribe((res: any) => {
                    if (res) {
                        Swal.fire('Success', 'Route added Successfully..!', 'success');
                        this.modalService.dismissAll();
                        this.ngOnInit();
                    }
                });
        } else {
            this.updateRoute();
        }
    }

    handlePageSizeChange(size: number) {
        this.queryObj.size = size;
        this.queryObj.page = 1;
        this.getAllRouteConfigs();
    }

    changePage(event: number) {
        this.queryObj.page = event;
        this.getAllRouteConfigs();
    }

    refreshData() {
        this.httpService.getAll(this.apiUrls.refreshData + '?username=' + this.username, this.queryObj)
            .subscribe((res: any) => {
                if (res) {
                    Swal.fire('Success', 'Data refreshed Successfully..!', 'success');
                    this.routesData = res.result.fareConfig;
                    this.totalCount = res.result.total;
                    PaginationDirective.pagination(this.totalCount, this.queryObj);
                }
            });
    }

    public showModal(modal: any) {
        this.modalService.open(modal, {size: 'lg'});
    }

    updateRoute() {
        for (var key of Object.keys(this.updateRouteObj)) {
            if (!this.updateRouteObj[key]) {
                this.errors = [];
                this.errors.push('Please enter (*) Fields');
            }
        }
        this.updateRouteObj.username = this.username;
        delete this.updateRouteObj.sourcecity;
        delete this.updateRouteObj.destinationcity;
        this.httpService
            .update(this.apiUrls.updateRoute + this.routeId, this.updateRouteObj)
            .subscribe((res: any) => {
                if (res) {
                    Swal.fire('Success', 'Route updated Successfully..!', 'success');
                    this.modalService.dismissAll();
                    this.ngOnInit();
                }
            });
    }
}
