package dungeonmania.entities.enemies.movement;

import dungeonmania.Game;
import dungeonmania.entities.enemies.Enemy;
import dungeonmania.util.Position;

public class TrackPlayer implements Movement {
    @Override
    public Position getNextPosition(Game game, Enemy enemy) {
        return game.getMap().dijkstraPathFind(enemy.getPosition(), game.getPlayerPosition(), enemy);
    }

}
