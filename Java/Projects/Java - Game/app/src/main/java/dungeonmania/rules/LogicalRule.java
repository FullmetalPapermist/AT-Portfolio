package dungeonmania.rules;

import dungeonmania.entities.Entity;
import dungeonmania.map.GameMap;

public interface LogicalRule {
    public boolean checkActive(Entity entity, GameMap map);
}
