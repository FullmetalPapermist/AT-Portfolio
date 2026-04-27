package dungeonmania.entities.logical;

import dungeonmania.map.GameMap;

public interface Conductor {
    public boolean isActivated();

    public void activate();

    public int getTicksActive();

    public void tick(GameMap map);
}
