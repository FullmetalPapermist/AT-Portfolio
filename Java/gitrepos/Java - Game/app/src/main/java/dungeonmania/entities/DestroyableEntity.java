package dungeonmania.entities;

import dungeonmania.map.GameMap;

public interface DestroyableEntity {
    public void onDestroy(GameMap map);
}
