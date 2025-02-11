class CollisionDetector {
    static checkRectangleCollision(rect1, rect2) {
        return !(rect1.x + rect1.width < rect2.x ||
                rect1.x > rect2.x + rect2.width ||
                rect1.y + rect1.height < rect2.y ||
                rect1.y > rect2.y + rect2.height);
    }

    static isOutOfBounds(object, canvasWidth, canvasHeight) {
        return (object.x < 0 ||
                object.x + object.width > canvasWidth ||
                object.y < 0 ||
                object.y + object.height > canvasHeight);
    }

    static checkGoalZoneCollision(player, goalZone) {
        return this.checkRectangleCollision(player, goalZone);
    }

    static checkObstaclesCollision(player, obstacles) {
        return obstacles.some(obstacle => 
            this.checkRectangleCollision(player, obstacle)
        );
    }

    static checkSafeZoneCollision(player, safeZones) {
        return safeZones.some(zone => 
            this.checkRectangleCollision(player, zone)
        );
    }
}
