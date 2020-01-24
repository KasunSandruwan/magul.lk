import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  localStorage_ADMIN_Auth_token,
  localStorage_ADMIN_Auth_user
} from 'src/app/config/app.constants';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IAdmin } from '../models/IAdmin';
import { IPaginatedResult } from '../config/constants';

export const enum AdminAuthState {
  default = 0,
  AdminLoggedIn = 1,
  guest = 2
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  authToken = new BehaviorSubject<string>(null);

  adminAccount = new BehaviorSubject<IAdmin>(null);
  authState = new BehaviorSubject<number>(AdminAuthState.default);

  constructor(private http: HttpClient) {
    this.initApp();
  }
  async initApp() {
    const v = await this.authCheck();
    if (v) {
      this.authState.next(AdminAuthState.AdminLoggedIn);
      return true;
    } else {
      this.authState.next(AdminAuthState.guest);
    }
    return false;
  }
  async login(email: string, password: string): Promise<boolean> {
    try {
      const data: any = await this.http
        .post(environment.apiOrigin + '/admin/loginAdmin?apiKey=' + environment.apiKey, {
          email,
          password
        })
        .toPromise();

      localStorage.setItem(localStorage_ADMIN_Auth_token, data.token);
      localStorage.setItem(localStorage_ADMIN_Auth_user, JSON.stringify(data.user));

      this.authToken.next(data.token);
      this.adminAccount.next(data.user);
      this.authState.next(AdminAuthState.AdminLoggedIn);
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async authCheck(): Promise<boolean> {
    try {
      if (this.adminAccount.value != null) {
        return true;
      } else {
        const storedToken = localStorage.getItem(localStorage_ADMIN_Auth_token);
        if (storedToken == 'null' || storedToken == null || storedToken == undefined) {
          return false;
        } else {
          this.authToken.next(storedToken);
          const user = await this.getAdminAccount();
          if (user == null) {
            return false;
          }
          this.adminAccount.next(user);
          return true;
        }
      }
    } catch (err) {
      return false;
    }
  }
  async getAdminAccount(): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authToken.value
      });
      const data: any = await this.http
        .get(environment.apiOrigin + '/admin/myAccount?apiKey=' + environment.apiKey, {
          headers: headers
        })
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async getAdminAccounts(): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authToken.value
      });
      const data: any = await this.http
        .get(environment.apiOrigin + '/users/admin/admins/accounts?apiKey=' + environment.apiKey, {
          headers: headers
        })
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async creatAdminAccount(email: string, password: string): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authToken.value
      });
      const data: any = await this.http
        .post(
          environment.apiOrigin + '/users/admin/admins/create?apiKey=' + environment.apiKey,
          {
            email,
            password
          },
          {
            headers: headers
          }
        )
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async updateAdminAccount(email: string, password: string, admin_id: string): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authToken.value
      });
      const data: any = await this.http
        .post(
          environment.apiOrigin + '/users/admin/admins/update?apiKey=' + environment.apiKey,
          {
            admin_id,
            email,
            password
          },
          {
            headers: headers
          }
        )
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async superAdminPasswordChange(current_password: string, new_password: string): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authToken.value
      });
      const data: any = await this.http
        .post(
          environment.apiOrigin +
            '/users/admin/admins/superAdminPasswordChange?apiKey=' +
            environment.apiKey,
          {
            current_password,
            new_password
          },
          {
            headers: headers
          }
        )
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteAdmin(admin_id: string): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authToken.value
      });
      const data: any = await this.http
        .post(
          environment.apiOrigin + '/users/admin/admins/delete?apiKey=' + environment.apiKey,
          {
            admin_id
          },
          {
            headers: headers
          }
        )
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  signout() {
    localStorage.setItem(localStorage_ADMIN_Auth_token, null);
  }

  async deleteNewsPhoto(imageId: string): Promise<any> {
    try {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.authToken.value
      });
      const data: any = await this.http
        .post(
          environment.apiOrigin + '/news/deleteImage?apiKey=' + environment.apiKey,
          { imageId },
          {
            headers: headers
          }
        )
        .toPromise();
      return data;
    } catch (err) {
      console.error(err);
      if (err.error.message) {
        throw err.error.message;
      }
      throw err;
    }
  }

  async contact_messages_list(
    status: string = 'any',
    cat: number = 0,
    keyword: string = '',
    limit: number,
    skip: number
  ): Promise<IPaginatedResult> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });
    return this.http
      .get<IPaginatedResult>(
        `${environment.apiOrigin}/app/admin/contactMessage/list?apiKey=${
          environment.apiKey
        }&status=${status}&keyword=${keyword}&limit=${limit}&skip=${skip}&cat=${cat}`,
        {
          headers: headers
        }
      )
      .toPromise();
  }

  async promoted_post_history(post_id: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });
    return this.http
      .get<IPaginatedResult>(
        `${environment.apiOrigin}/promote/admin/promoted_post_history?apiKey=${
          environment.apiKey
        }&post_id=${post_id}`,
        {
          headers: headers
        }
      )
      .toPromise();
    return;
  }
  async promote_post_list(
    status: string = 'any',
    post_type: string = 'any',
    duration_type: string = 'any',
    keyword: string = '',
    limit: number,
    skip: number
  ): Promise<IPaginatedResult> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });
    return this.http
      .get<IPaginatedResult>(
        `${environment.apiOrigin}/promote/admin/promoted_posts/list?apiKey=${
          environment.apiKey
        }&status=${status}&keyword=${keyword}&post_type=${post_type}&duration_type=${duration_type}&limit=${limit}&skip=${skip}`,
        {
          headers: headers
        }
      )
      .toPromise();
  }

  async payments_history_list(
    user_id: string = null,
    post_type: string = 'any',
    status_prop: string,
    limit: number,
    skip: number
  ): Promise<IPaginatedResult> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });
    return this.http
      .get<IPaginatedResult>(
        `${environment.apiOrigin}/promote/admin/payments_history?apiKey=${
          environment.apiKey
        }&user_id=${user_id}&post_type=${post_type}&status_prop=${status_prop}&limit=${limit}&skip=${skip}`,
        {
          headers: headers
        }
      )
      .toPromise();
  }

  async mark_as_read_message(message_id: string): Promise<IPaginatedResult> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });
    return this.http
      .post<IPaginatedResult>(
        `${environment.apiOrigin}/app/admin/contactMessage/mark_as_read?apiKey=${
          environment.apiKey
        }`,
        {
          message_id
        },
        {
          headers: headers
        }
      )
      .toPromise();
  }

  async deleteMessage(message_id: string): Promise<IPaginatedResult> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });
    return this.http
      .post<IPaginatedResult>(
        `${environment.apiOrigin}/app/admin/contactMessage/delete?apiKey=${environment.apiKey}`,
        {
          message_id
        },
        {
          headers: headers
        }
      )
      .toPromise();
  }

  async list_backups(backup_mngr_key: string): Promise<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });
    return this.http
      .post(
        `${environment.apiOrigin}/app/admin/list_backups?apiKey=${environment.apiKey}`,
        { backup_mngr_key },
        {
          headers: headers
        }
      )
      .toPromise();
  }

  async download_backup(backup_mngr_key: string, tag: string, backup_name: string): Promise<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authToken.value
    });

    return this.http
      .get(
        `${environment.apiOrigin}/app/admin/download_backup/gen?apiKey=${
          environment.apiKey
        }&backup_mngr_key=${backup_mngr_key}&tag=${tag}&backup_name=${backup_name}`,
        {
          headers: headers
          // responseType: 'arraybuffer'
        }
      )
      .toPromise();
  }
}
