package dungeonmania.entities;

import java.util.List;

import dungeonmania.util.Position;

public abstract class PositionEntity extends Entity {
    private Position position;

    public PositionEntity(Position position) {
        this.position = position;
    }

    public Position getPosition() {
        return position;
    }

    public int getX() {
        return position.getX();
    }

    public int getY() {
        return position.getY();
    }

    public List<Position> getCardinallyAdjacentPositions() {
        return position.getCardinallyAdjacentPositions();
    }

    public List<Position> getAdjacentPositions() {
        return position.getAdjacentPositions();
    }

    public void setPosition(Position position) {
        this.position = position;
    }
}
