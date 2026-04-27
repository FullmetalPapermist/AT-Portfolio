package dungeonmania.entities.logical;

import dungeonmania.entities.PositionEntity;
import dungeonmania.map.GameMap;
import dungeonmania.rules.LogicalRule;
import dungeonmania.util.Position;

public class LightBulb extends PositionEntity implements LogicalEntity {
    private LogicalRule logicalRule;
    private boolean activated = false;

    public LightBulb(Position position, LogicalRule logicalRule) {
        super(position);
        this.logicalRule = logicalRule;
    }

    @Override
    public void checkIfActive(GameMap map) {
        activated = logicalRule.checkActive(this, map);
    }

    @Override
    public boolean isActivated() {
        return activated;
    }

}
