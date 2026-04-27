package dungeonmania.entities.enemies.movement;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import dungeonmania.Game;
import dungeonmania.entities.enemies.Enemy;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class RandomMovement implements Movement {
    @Override
    public Position getNextPosition(Game game, Enemy enemy) {
        Random randGen = new Random();
        GameMap map = game.getMap();
        List<Position> pos = enemy.getCardinallyAdjacentPositions();
        pos = pos.stream().filter(p -> map.canMoveTo(enemy, p)).collect(Collectors.toList());
        if (pos.size() == 0) {
            return enemy.getPosition();
        } else {
            return pos.get(randGen.nextInt(pos.size()));
        }
    }

}
