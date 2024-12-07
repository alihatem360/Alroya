  import { Component, OnInit } from '@angular/core';
  import { MatDialogRef } from '@angular/material/dialog';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { BaseService } from '../../services/Base/base.service';
  import { APIConstant } from '../../constant/APIConstant';
  import { IPostResponse } from '../../models/interfaces/Response';
  import { MatButtonModule } from '@angular/material/button';
  import { MatDialogModule } from '@angular/material/dialog';
  import { ReactiveFormsModule } from '@angular/forms';
  import { SharedModule } from '../../shared.module';
  import { GoogleMapsModule } from '@angular/google-maps';
  import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

  @Component({
    selector: 'app-add-address',
    templateUrl: './AddAddress.component.html',
    standalone: true,
    styleUrls: ['./AddAddress.component.css'],
    imports: [MatButtonModule, MatIconModule,MatTooltip ,MatDialogModule, ReactiveFormsModule, SharedModule, GoogleMapsModule],
  })

  export class AddAddressComponent implements OnInit {
    addressForm!: FormGroup;
    loading = false;
    currentLocation: string = '';
    map!: google.maps.Map;
    marker!: google.maps.Marker;
    markers: google.maps.Marker[] = [];
    userLocation: { lat: number; lng: number } | null = null;
    isSubmitting = false;

    constructor(
      private baseService: BaseService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AddAddressComponent>
    ) {}

    ngOnInit(): void {
      this.initializeForm();
      this.initMap();
    }

    private initializeForm(): void {
      this.addressForm = this.fb.group({
        name: ['', Validators.required],
      });
    }

    closeDialog(): void {
      this.dialogRef.close();
    }

    private initMap(): void {
      this.map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          zoom: 13,
          disableDoubleClickZoom: true,
        }
      );

      this.marker = new google.maps.Marker({
        map: this.map,
        draggable: true,
      });

      this.getCurrentLocation();

      this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
        this.addMarker(event.latLng!);
      });

      this.marker.addListener('dragend', () => {
        const position = this.marker.getPosition();
        if (position) {
          this.updateLocation(position.lat(), position.lng());
        }
      });

      this.initSearchBox();
    }

    private initSearchBox(): void {
      const input = document.getElementById('pac-input') as HTMLInputElement;
      const searchBox = new google.maps.places.SearchBox(input);
      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      this.map.addListener('bounds_changed', () => {
        searchBox.setBounds(this.map.getBounds()!);
      });

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (!places || places.length === 0) return;

        this.clearMarkers();
        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) return;

          const location = place.geometry.location;
          this.marker.setPosition(location);
          this.updateLocation(location.lat(), location.lng());

          place.geometry.viewport ? bounds.union(place.geometry.viewport) : bounds.extend(location);
        });

        this.map.fitBounds(bounds);
      });
    }

    private addMarker(location: google.maps.LatLng): void {
      this.marker.setPosition(location);
      this.updateLocation(location.lat(), location.lng());
    }

    private updateLocation(lat: number, lng: number): void {
      this.currentLocation = `${lat}, ${lng}`;
      this.getAddressFromLatLng(lat, lng);
    }

    private updateMapAndMarker(location: { lat: number; lng: number }): void {
      this.map.setCenter(location);
      this.marker.setPosition(location);
      this.updateLocation(location.lat, location.lng);
    }

    private getAddressFromLatLng(lat: number, lng: number): void {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          this.addressForm.patchValue({ name: results[0].formatted_address });
        } else {
          console.error('Geocoder failed due to: ' + status);
        }
      });
    }

    private getCurrentLocation(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.userLocation = userLocation;
            this.updateMapAndMarker(userLocation);
          },
          (error) => {
            console.error('Geolocation error: ', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }

    private clearMarkers(): void {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    }

    goToCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map.panTo(userLocation);
          this.map.setZoom(15); 
        });
      }
    }
    onSubmit(): void {
      if (this.addressForm.invalid) return;

      this.loading = true;
      this.isSubmitting = true;

      this.baseService.create(APIConstant.Addresses, this.addressForm.value).subscribe({
        next: (response: IPostResponse) => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          this.isSubmitting = false;
          console.error('Error submitting address: ', error);
        },
      });
    }
  }
