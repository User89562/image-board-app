import { OverlayArchiveDeleteFilterMobileComponent } from './../overlay/overlay-archive-delete-filter-mobile/overlay-archive-delete-filter-mobile.component';
import { OverlayArchiveDeleteFilterComponent } from './../overlay/overlay-archive-delete-filter/overlay-archive-delete-filter.component';

import { OverlayComponent } from './../overlay/overlay.component';
import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ViewContainerRef } from "@angular/core";

export class OverlayUtil {
    overlayRef!: OverlayRef;
    constructor(private viewContainerRef: ViewContainerRef, private overlay: Overlay,) {}

    createProcessingOverlay(): void {
        const config = new OverlayConfig();
        config.positionStrategy = this.overlay.position()
            .global().centerHorizontally().centerVertically();
    
        config.hasBackdrop = true;
        this.overlayRef = this.overlay.create(config);
        const containerPortal = new ComponentPortal(OverlayComponent, this.viewContainerRef);
    
        this.overlayRef.attach(containerPortal);
    }

    createFullscreenOverlay(): void {
        const config = new OverlayConfig();
        config.positionStrategy = this.overlay.position()
            .global().centerHorizontally().centerVertically();
        config.backdropClass = 'backdrop-class';
    
        config.hasBackdrop = true;
        this.overlayRef = this.overlay.create(config);
        const containerPortal = new ComponentPortal(OverlayArchiveDeleteFilterComponent, this.viewContainerRef);
    
        this.overlayRef.attach(containerPortal);
    }

    createMobileOverlay(): void {
        const config = new OverlayConfig();
        config.positionStrategy = this.overlay.position()
            .global().centerHorizontally().centerVertically();
        config.backdropClass = 'backdrop-class';
    
        config.hasBackdrop = true;
        this.overlayRef = this.overlay.create(config);
        const containerPortal = new ComponentPortal(OverlayArchiveDeleteFilterMobileComponent, this.viewContainerRef);
    
        this.overlayRef.attach(containerPortal);
    }

    closeOverlay(): void {
        this.overlayRef.dispose();
    }
}