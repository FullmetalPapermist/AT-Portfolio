package dungeonmania.entities.collectables;

import dungeonmania.entities.Entity;
import dungeonmania.entities.OverlappableEntity;
import dungeonmania.entities.Player;
import dungeonmania.entities.PositionEntity;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public abstract class Collectable extends PositionEntity implements OverlappableEntity {
    public Collectable(Position position) {
        super(position);
    }

    @Override
    public void onOverlap(GameMap map, Entity entity) {
        if (entity instanceof Player) {
            if (!((Player) entity).pickUp(this))
                return;
            map.destroyEntity(this);
        }
    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        return true;
    }
}
