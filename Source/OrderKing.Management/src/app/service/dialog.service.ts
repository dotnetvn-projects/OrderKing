import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  showError(message: string, action = null) {
    swal({
      title: 'Lỗi!',
      text: message,
      type: 'error',
      confirmButtonText: 'Đóng'
    }).then((result) => {
          if (action!=null) {
            setTimeout(() => {
              action();
            }, 500);       
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
        if (action!=null) {
          action();
        }
      }    
    });
  }
}
