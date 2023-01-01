import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlsService {
  mainUrl = environment.testPath;

  getCurrentUser = 'api/v1/user/me';
  getAllRoutes = '/api/v1/fareconfig/getFareList';
  getSlabs = '/api/v1/slab/getSlabs';
  getAllSlabs = '/api/v1/slab/getAll';
  saveRoute = '/api/v1/fareconfig/createFareConfig';
  updateRoute = '/api/v1/fareconfig/updateFareConfig/';
  refreshData = '/api/v1/rateConfig/refreshdata';
  saveSlab = '/api/v1/rateConfig/addRateConfig';
  updateSlab = '/api/v1/rateConfig/updateRateConfig/';
  getAllLogs = '/api/v1/logs/getAll';
}
