package dungeonmania.entities.enemies;

import dungeonmania.Game;
import dungeonmania.entities.collectables.potions.InvincibilityPotion;
import dungeonmania.entities.enemies.movement.EscapeMovement;
import dungeonmania.entities.enemies.movement.RandomMovement;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class ZombieToast extends HumanoidEnemy {
    public static final double DEFAULT_HEALTH = 5.0;
    public static final double DEFAULT_ATTACK = 6.0;

    public ZombieToast(Position position, double health, double attack) {
        super(position, health, attack);
    }

    @Override
    public void move(Game game) {
        GameMap map = game.getMap();
        if (map.getPlayer().getEffectivePotion() instanceof InvincibilityPotion) {
            setMovementAlgorithm(new EscapeMovement());
        } else {
            setMovementAlgorithm(new RandomMovement());
        }
        super.move(game);

    }

}
