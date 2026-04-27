package dungeonmania.entities.buildables;

import dungeonmania.entities.Entity;
import dungeonmania.entities.inventory.InventoryItem;

public class Sceptre extends Entity implements InventoryItem {
    private int mindControlledDuration;

    public Sceptre(int mindControlledDuration) {
        this.mindControlledDuration = mindControlledDuration;
    }

    public int getMindControlledDuration() {
        return mindControlledDuration;
    }

}
