package dungeonmania.rules;

import java.util.List;

import dungeonmania.entities.Entity;
import dungeonmania.entities.PositionEntity;
import dungeonmania.entities.logical.Conductor;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class CoAnd implements LogicalRule {
    @Override
    public boolean checkActive(Entity entity, GameMap map) {
        List<Position> adjPosList = ((PositionEntity) entity).getCardinallyAdjacentPositions();
        int ticksActive = -1;
        int numActive = 0;
        for (Position node : adjPosList) {
            List<Conductor> conductors = map.getConductors(node);
            for (Conductor conductor : conductors) {
                if (!conductor.isActivated()) {
                    return false;
                }
                numActive++;
                if (ticksActive == -1) {
                    ticksActive = conductor.getTicksActive();
                } else if (ticksActive != conductor.getTicksActive()) {
                    return false;
                }
            }
        }
        if (numActive >= 2) {
            return true;
        }
        return false;
    }
}
