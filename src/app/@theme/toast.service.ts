import { Injectable } from '@angular/core';
import { NbGlobalLogicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

export { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(
    protected toastrService: NbToastrService,
  ) { }

  showToast(message: string, title: string, status: NbToastStatus) {
    // toast config
    const destroyByClick = false;
    const duration = 4000;
    const hasIcon = true;
    const position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
    const preventDuplicates = false;
    const config = {
      status: status,
      destroyByClick: destroyByClick,
      duration: duration,
      hasIcon: hasIcon,
      position: position,
      preventDuplicates: preventDuplicates,
    };
    this.toastrService.show(message, title, config);
  }
}
