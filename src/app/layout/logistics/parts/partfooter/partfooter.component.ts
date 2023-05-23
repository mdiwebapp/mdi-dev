import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-partfooter',
  templateUrl: './partfooter.component.html',
  styleUrls: ['./partfooter.component.scss']
})
export class PartfooterComponent implements OnInit {
  routName: string;
  constructor(private location: Location, private router: Router) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.routName = location.path();
      } else {
        this.routName = '/dashboard';
      }
    });
  }

  ngOnInit(): void {
  }

}
