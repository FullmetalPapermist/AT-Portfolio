package dungeonmania.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import dungeonmania.entities.collectables.Bomb;
import dungeonmania.entities.logical.Conductor;
import dungeonmania.entities.logical.Wire;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class Switch extends PositionEntity implements MovableEntity, OverlappableEntity, Conductor {
    private boolean activated;
    private List<Bomb> bombs = new ArrayList<>();
    private int ticksActive = 0;

    public Switch(Position position) {
        super(position.asLayer(Entity.ITEM_LAYER));
    }

    public void subscribe(Bomb b) {
        bombs.add(b);
    }

    public void subscribe(Bomb bomb, GameMap map) {
        bombs.add(bomb);
        if (activated) {
            bombs.stream().forEach(b -> b.notify(map));
        }
    }

    public void unsubscribe(Bomb b) {
        bombs.remove(b);
    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        return true;
    }

    @Override
    public void onOverlap(GameMap map, Entity entity) {
        if (entity instanceof Boulder) {
            activated = true;
            bombs.stream().forEach(b -> b.notify(map));
            notifySurrounds(map);
        }
    }

    @Override
    public void onMovedAway(GameMap map, Entity entity) {
        if (entity instanceof Boulder) {
            activated = false;
            ticksActive = 0;
            notifySurrounds(map);
        }
    }

    public void notifySurrounds(GameMap map) {
        // notify surrounding wires to activate or deactivate
        List<Position> adjPosList = getPosition().getCardinallyAdjacentPositions();
        adjPosList.stream().forEach(node -> {
            List<Entity> wires = map.getEntities(node).stream().filter(e -> (e instanceof Wire))
                    .collect(Collectors.toList());
            wires.stream().forEach(c -> {
                if (((Wire) c).isActivated() != activated) {
                    if (activated) {
                        ((Wire) c).activate();
                        ((Wire) c).notifySurrounds(map);
                    } else {
                        ((Wire) c).deactivate();
                        ((Wire) c).notifySurrounds(map);
                    }
                }
            });
        });
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

    @Override
    public int getTicksActive() {
        return ticksActive;
    }

    @Override
    public void tick(GameMap map) {
        if (activated) {
            notifySurrounds(map);
            ticksActive++;
        }
    }
}
