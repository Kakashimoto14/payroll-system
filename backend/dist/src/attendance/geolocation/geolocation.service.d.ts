import { PrismaService } from '../../prisma/prisma.service';
export interface GeofenceResult {
    isWithinRange: boolean;
    nearestBranch: {
        id: string;
        name: string;
        distance: number;
    } | null;
    employeeCoordinates: {
        latitude: number;
        longitude: number;
    };
    message: string;
}
export declare class GeolocationService {
    private readonly prisma;
    private readonly EARTH_RADIUS_METERS;
    constructor(prisma: PrismaService);
    verifyLocation(latitude: number, longitude: number): Promise<GeofenceResult>;
    private calculateHaversineDistance;
}
