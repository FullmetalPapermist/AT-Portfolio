package dungeonmania.rules;

import java.util.List;

import dungeonmania.entities.Entity;
import dungeonmania.entities.PositionEntity;
import dungeonmania.entities.logical.Conductor;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class And implements LogicalRule {
    @Override
    public boolean checkActive(Entity entity, GameMap map) {
        List<Position> adjPosList = ((PositionEntity) entity).getCardinallyAdjacentPositions();
        int numConductors = 0;
        for (Position node : adjPosList) {
            List<Conductor> conductors = map.getConductors(node);
            for (Conductor conductor : conductors) {
                numConductors++;
                if (!conductor.isActivated()) {
                    return false;
                }
            }
        }
        if (numConductors >= 2) {
            return true;
        }
        return false;
    }
}
