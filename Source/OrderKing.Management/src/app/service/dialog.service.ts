import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  constructor (private spinner: NgxSpinnerService) {

  }


  showWaiting(action) {
    this.spinner.show();
    action();
    setTimeout(() => {
      this.spinner.hide();
  }, 1000);
  }

  showError(message: string, action = null) {
    swal({
      title: 'Lỗi!',
      text: message,
      type: 'error',
      confirmButtonText: 'Đóng'
    }).then((result) => {
          if (action !== null) {
            setTimeout(() => {
              action();
            }, 500);
          }
    });
  }

  showConfirm(title: string, message: string, action) {
    swal({
      title: title,
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xử lý',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.value) {
        action();
      }
    });
  }

  showSuccess(message: string, action = null) {
    swal({
      position: 'top-end',
      type: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
      onClose: () => {
        if (action !== null) {
          action();
        }
      }
    });
  }

  showInfo(title: string, message: string, action = null) {
    swal({
      position: 'top',
      title: title,
      html: message,
      showConfirmButton: true,
      onClose: () => {
        if (action !== null) {
          action();
        }
      }
    });
  }
}
