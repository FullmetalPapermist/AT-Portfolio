package dungeonmania.entities.enemies.movement;

import dungeonmania.Game;
import dungeonmania.entities.enemies.Enemy;
import dungeonmania.map.GameMap;
import dungeonmania.util.Direction;
import dungeonmania.util.Position;

public class EscapeMovement implements Movement {
    @Override
    public Position getNextPosition(Game game, Enemy enemy) {
        Position nextPos;
        GameMap map = game.getMap();
        Position plrDiff = Position.calculatePositionBetween(map.getPlayerPosition(), enemy.getPosition());

        Position moveX = (plrDiff.getX() >= 0) ? Position.translateBy(enemy.getPosition(), Direction.RIGHT)
                : Position.translateBy(enemy.getPosition(), Direction.LEFT);
        Position moveY = (plrDiff.getY() >= 0) ? Position.translateBy(enemy.getPosition(), Direction.UP)
                : Position.translateBy(enemy.getPosition(), Direction.DOWN);
        nextPos = enemy.getPosition();
        if (plrDiff.getY() == 0 && map.canMoveTo(enemy, moveX))
            nextPos = moveX;
        else if (plrDiff.getX() == 0 && map.canMoveTo(enemy, moveY))
            nextPos = moveY;
        else if (Math.abs(plrDiff.getX()) >= Math.abs(plrDiff.getY())) {
            if (map.canMoveTo(enemy, moveX))
                nextPos = moveX;
            else if (map.canMoveTo(enemy, moveY))
                nextPos = moveY;
            else
                nextPos = enemy.getPosition();
        } else {
            if (map.canMoveTo(enemy, moveY))
                nextPos = moveY;
            else if (map.canMoveTo(enemy, moveX))
                nextPos = moveX;
            else
                nextPos = enemy.getPosition();
        }
        return nextPos;
    }

}
