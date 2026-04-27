package dungeonmania.entities.logical;

import dungeonmania.map.GameMap;

public interface LogicalEntity {
    public void checkIfActive(GameMap map);

    public boolean isActivated();
}
