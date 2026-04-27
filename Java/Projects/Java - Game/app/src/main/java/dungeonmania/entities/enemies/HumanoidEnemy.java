package dungeonmania.entities.enemies;

import dungeonmania.Game;
import dungeonmania.entities.enemies.movement.Movement;
import dungeonmania.util.Position;

public abstract class HumanoidEnemy extends Enemy {
    private Movement movementAlgorithm;

    public HumanoidEnemy(Position position, double health, double attack) {
        super(position, health, attack);
    }

    protected Movement getMovementAlgorithm() {
        return movementAlgorithm;
    }

    protected void setMovementAlgorithm(Movement movementAlgorithm) {
        this.movementAlgorithm = movementAlgorithm;
    }

    @Override
    public void move(Game game) {
        Position nextPos = movementAlgorithm.getNextPosition(game, this);
        game.moveTo(this, nextPos);

    }

}
