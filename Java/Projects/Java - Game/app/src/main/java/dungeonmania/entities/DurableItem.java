package dungeonmania.entities;

import dungeonmania.Game;

/**
 * Item has limited durability
 */
public interface DurableItem {
    public void use(Game game);

    public int getDurability();
}
