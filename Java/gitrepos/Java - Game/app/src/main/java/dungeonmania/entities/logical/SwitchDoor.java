package dungeonmania.entities.logical;

import dungeonmania.entities.Entity;
import dungeonmania.entities.PositionEntity;
import dungeonmania.map.GameMap;
import dungeonmania.rules.LogicalRule;
import dungeonmania.util.Position;

public class SwitchDoor extends PositionEntity implements LogicalEntity {
    private LogicalRule logicalRule;
    private boolean activated = false;

    public SwitchDoor(Position position, LogicalRule logicalRule) {
        super(position);
        this.logicalRule = logicalRule;
    }

    @Override
    public void checkIfActive(GameMap map) {
        if (logicalRule.checkActive(this, map)) {
            activated = true;
        }
    }

    @Override
    public boolean isActivated() {
        return activated;
    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        return activated;
    }

}
