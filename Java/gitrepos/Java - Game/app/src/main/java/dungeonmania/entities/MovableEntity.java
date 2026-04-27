package dungeonmania.entities;

import dungeonmania.map.GameMap;

public interface MovableEntity {
    public void onMovedAway(GameMap map, Entity entity);
}
