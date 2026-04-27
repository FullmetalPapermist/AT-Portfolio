package dungeonmania.entities.logical;

import java.util.List;

import dungeonmania.entities.PositionEntity;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class Wire extends PositionEntity implements Conductor {
    private boolean activated = false;
    private int ticksActive = 0;

    public Wire(Position position) {
        super(position);
    }

    @Override
    public boolean isActivated() {
        return activated;
    }

    @Override
    public void activate() {
        if (!activated) {
            activated = true;
            ticksActive = 1;
        }
    }

    public void deactivate() {
        if (activated) {
            activated = false;
            ticksActive = 0;
        }
    }

    public void notifySurrounds(GameMap map) {
        // notify surrounding wires to activate or deactivate
        List<Position> adjPosList = getCardinallyAdjacentPositions();
        adjPosList.stream().forEach(node -> {
            List<Wire> wires = map.getWires(node);
            wires.stream().forEach(c -> {
                if (c.isActivated() != activated) {
                    if (activated) {
                        c.activate();
                        c.notifySurrounds(map);
                    } else {
                        c.deactivate();
                        c.notifySurrounds(map);
                    }
                }
            });
        });
    }

    public void notify(GameMap map, boolean active) {
        activated = active;
        notifySurrounds(map);
    }

    @Override
    public int getTicksActive() {
        return ticksActive;
    }

    @Override
    public void tick(GameMap map) {
        if (activated)
            ticksActive++;
    }

    public void setTicksActive(int ticksActive) {
        this.ticksActive = ticksActive;
    }

}
