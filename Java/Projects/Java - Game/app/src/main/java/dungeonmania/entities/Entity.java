package dungeonmania.entities;

import dungeonmania.map.GameMap;

import java.util.UUID;

public abstract class Entity {
    public static final int FLOOR_LAYER = 0;
    public static final int ITEM_LAYER = 1;
    public static final int DOOR_LAYER = 2;
    public static final int CHARACTER_LAYER = 3;

    private String entityId;

    public Entity() {

        this.entityId = UUID.randomUUID().toString();
    }

    public boolean canMoveOnto(GameMap map, Entity entity) {
        return false;
    }

    public String getId() {
        return entityId;
    }

}
