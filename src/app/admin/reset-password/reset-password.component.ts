import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth-service.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token!: string;
  email!: string;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    });

    this.token = this.route.snapshot.paramMap.get('token') || ''; //get token in paramaters route
    this.email = localStorage.getItem('resetEmail') || ''; // Get email from localStorage if available
  }
  
  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }
    
    const { password, password_confirmation } = this.resetPasswordForm.value;

    this.authService.resetPassword(this.token, this.email, password, password_confirmation)
      .subscribe(
        response => {
          console.log('Password reset response:', response); // Log the response for debugging
          alert('Password reset successfully');
          this.router.navigate(['/admin/login']);
        },
        error => {
          console.error('Error resetting password:', error);
          alert('Failed to reset password. Please try again later.');
        }
      );
  }
}
