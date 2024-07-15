import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocationService } from './location.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationSelectorComponent implements OnInit {
  @Output() countryChange = new EventEmitter<number>();
  @Output() stateChange = new EventEmitter<number>();
  @Output() cityChange = new EventEmitter<number>();

  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.locationService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  onCountryChange(event: any): void {
    const countryId = event.target.value;
    this.countryChange.emit(countryId);
    this.locationService.getStates(countryId).subscribe(data => {
      this.states = data;
      this.cities = [];  // Reset cities when country changes
    });
  }

  onStateChange(event: any): void {
    const stateId = event.target.value;
    this.stateChange.emit(stateId);
    this.locationService.getCities(stateId).subscribe(data => {
      this.cities = data;
    });
  }

  onCityChange(event: any): void {
    const cityId = event.target.value;
    this.cityChange.emit(cityId);
  }
}
