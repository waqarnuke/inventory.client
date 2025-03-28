import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbar = inject(MatSnackBar);

  error(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-error'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  success(message: string) {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-success'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  showInfo(message: string) {
    this.snackbar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snack-info'], // ✅ INFO class
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
