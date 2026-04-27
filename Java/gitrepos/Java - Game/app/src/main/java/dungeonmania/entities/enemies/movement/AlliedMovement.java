package dungeonmania.entities.enemies.movement;

import dungeonmania.Game;
import dungeonmania.entities.Player;
import dungeonmania.entities.enemies.Enemy;
import dungeonmania.entities.enemies.Mercenary;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class AlliedMovement implements Movement {
    @Override
    public Position getNextPosition(Game game, Enemy enemy) {
        Mercenary mercenary = (Mercenary) enemy;
        Player player = game.getPlayer();
        GameMap map = game.getMap();
        Position nextPos = mercenary.getIsAdjacentToPlayer() ? ((Player) player).getPreviousDistinctPosition()
                : map.dijkstraPathFind(mercenary.getPosition(), player.getPosition(), mercenary);
        if (!mercenary.getIsAdjacentToPlayer() && Position.isAdjacent(player.getPosition(), nextPos)) {
            mercenary.setIsAdjacentToPlayer(true);
        }
        return nextPos;
    }

}
