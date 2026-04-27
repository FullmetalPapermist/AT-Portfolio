package dungeonmania.entities.enemies.movement;

import dungeonmania.Game;
import dungeonmania.entities.enemies.Enemy;
import dungeonmania.util.Position;

public interface Movement {
    public Position getNextPosition(Game game, Enemy enemy);

}
