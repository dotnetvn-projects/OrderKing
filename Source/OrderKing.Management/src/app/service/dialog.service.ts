import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  showError(message: string) {
    swal({
      title: 'Lỗi!',
      text: message,
      type: 'error',
      confirmButtonText: 'Đóng'
    });
    //swal(message);
  }
}
