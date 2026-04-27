package dungeonmania.entities;

import dungeonmania.map.GameMap;

public interface OverlappableEntity {
    public void onOverlap(GameMap map, Entity entity);
}
