import { NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-company',
  imports: [MatSidenavModule, MatButtonModule,RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  isMobile = false;
  showSidebar = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  selectItem(sidenav: any) {
    if (this.isMobile) {
      sidenav.close();
    }
  }
}
