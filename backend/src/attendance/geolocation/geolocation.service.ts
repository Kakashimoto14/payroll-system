// ============================================================================
// Geolocation Service — Multi-Branch Haversine Geofence Verification
//
// Verifies that an employee is within 500 meters of ANY configured
// McDonald's branch before allowing clock-in/clock-out.
//
// Supported branches:
// 1. McDonald's Montalban Highway: 14.7308°N, 121.1384°E
// 2. McDonald's Primark Kasiglahan: 14.7500°N, 121.1400°E
// ============================================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Result of a geolocation verification check.
 */
export interface GeofenceResult {
  isWithinRange: boolean;
  nearestBranch: { id: string; name: string; distance: number } | null;
  employeeCoordinates: { latitude: number; longitude: number };
  message: string;
}

@Injectable()
export class GeolocationService {
  /** Earth's radius in meters (mean value) */
  private readonly EARTH_RADIUS_METERS = 6371000;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verify if the employee's coordinates are within any branch's geofence.
   * Uses the Haversine formula for accurate GPS distance calculation.
   *
   * @param latitude - Employee's GPS latitude
   * @param longitude - Employee's GPS longitude
   * @returns GeofenceResult with verification status and nearest branch
   */
  async verifyLocation(
    latitude: number,
    longitude: number,
  ): Promise<GeofenceResult> {
    // Fetch all active branches from database
    const branches = await this.prisma.branch.findMany({
      where: { isActive: true },
    });

    if (branches.length === 0) {
      return {
        isWithinRange: false,
        nearestBranch: null,
        employeeCoordinates: { latitude, longitude },
        message: 'No active branches configured in the system.',
      };
    }

    // Check distance to each branch
    let nearestBranch: { id: string; name: string; distance: number } | null =
      null;
    let isWithinRange = false;

    for (const branch of branches) {
      const distance = this.calculateHaversineDistance(
        latitude,
        longitude,
        branch.latitude,
        branch.longitude,
      );

      if (!nearestBranch || distance < nearestBranch.distance) {
        nearestBranch = {
          id: branch.id,
          name: branch.name,
          distance: Math.round(distance),
        };
      }

      // Check if within the branch's configured radius (default 500m)
      if (distance <= branch.radius) {
        isWithinRange = true;
        nearestBranch = {
          id: branch.id,
          name: branch.name,
          distance: Math.round(distance),
        };
        break; // Found a valid branch, no need to check more
      }
    }

    return {
      isWithinRange,
      nearestBranch,
      employeeCoordinates: { latitude, longitude },
      message: isWithinRange
        ? `Location verified: ${Math.round(nearestBranch!.distance)}m from ${nearestBranch!.name}`
        : `Location denied: You are ${Math.round(nearestBranch!.distance)}m from the nearest branch (${nearestBranch!.name}). Must be within ${branches[0].radius}m.`,
    };
  }

  /**
   * Haversine Formula — calculates the great-circle distance between
   * two points on Earth given their latitude/longitude in decimal degrees.
   *
   * Formula:
   * a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
   * c = 2 × atan2(√a, √(1-a))
   * d = R × c
   *
   * @param lat1 - Latitude of point 1 (degrees)
   * @param lon1 - Longitude of point 1 (degrees)
   * @param lat2 - Latitude of point 2 (degrees)
   * @param lon2 - Longitude of point 2 (degrees)
   * @returns Distance in meters
   */
  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return this.EARTH_RADIUS_METERS * c;
  }
}
