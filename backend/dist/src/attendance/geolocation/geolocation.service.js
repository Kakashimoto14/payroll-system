"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GeolocationService = class GeolocationService {
    prisma;
    EARTH_RADIUS_METERS = 6371000;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyLocation(latitude, longitude) {
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
        let nearestBranch = null;
        let isWithinRange = false;
        for (const branch of branches) {
            const distance = this.calculateHaversineDistance(latitude, longitude, branch.latitude, branch.longitude);
            if (!nearestBranch || distance < nearestBranch.distance) {
                nearestBranch = {
                    id: branch.id,
                    name: branch.name,
                    distance: Math.round(distance),
                };
            }
            if (distance <= branch.radius) {
                isWithinRange = true;
                nearestBranch = {
                    id: branch.id,
                    name: branch.name,
                    distance: Math.round(distance),
                };
                break;
            }
        }
        return {
            isWithinRange,
            nearestBranch,
            employeeCoordinates: { latitude, longitude },
            message: isWithinRange
                ? `Location verified: ${Math.round(nearestBranch.distance)}m from ${nearestBranch.name}`
                : `Location denied: You are ${Math.round(nearestBranch.distance)}m from the nearest branch (${nearestBranch.name}). Must be within ${branches[0].radius}m.`,
        };
    }
    calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const toRadians = (deg) => (deg * Math.PI) / 180;
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.EARTH_RADIUS_METERS * c;
    }
};
exports.GeolocationService = GeolocationService;
exports.GeolocationService = GeolocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeolocationService);
//# sourceMappingURL=geolocation.service.js.map