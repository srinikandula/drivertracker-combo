import { Component, OnInit } from '@angular/core';
import { HttpService } from '@app/shared/services/http.service';
import { ApiUrlsService } from '@app/shared/services/api-urls.service';
import { PaginationDirective } from '@app/shared/directives/pagination.directive';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logsData: Array<any> = [];
  errors: Array<any> = [];
  queryObj: any = {
    page: 1,
    size: 50,
    pageSizes: [],
  };
  public totalCount = 0;
  constructor(
    private httpService: HttpService,
    private apiUrls: ApiUrlsService
  ) {}

  ngOnInit(): void {
    this.getAllLogs();
  }

  getAllLogs() {
    this.httpService
      .getAll(this.apiUrls.getAllLogs, this.queryObj)
      .subscribe((res: any) => {
        if (res) {
          this.logsData = res.result.data;
          this.totalCount = res.result.total;
          PaginationDirective.pagination(this.totalCount, this.queryObj);
        }
      });
  }

  handlePageSizeChange(size: number) {
    this.queryObj.size = size;
    this.queryObj.page = 1;
    this.getAllLogs();
  }

  changePage(event: number) {
    this.queryObj.page = event;
    this.getAllLogs();
  }
}
