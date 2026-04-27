package dungeonmania.entities.enemies;

import dungeonmania.Game;
import dungeonmania.battles.BattleStatistics;
import dungeonmania.entities.Entity;
import dungeonmania.entities.Interactable;
import dungeonmania.entities.Player;
import dungeonmania.entities.collectables.Treasure;
import dungeonmania.entities.collectables.potions.InvincibilityPotion;
import dungeonmania.entities.collectables.potions.InvisibilityPotion;
import dungeonmania.entities.enemies.movement.AlliedMovement;
import dungeonmania.entities.enemies.movement.EscapeMovement;
import dungeonmania.entities.enemies.movement.RandomMovement;
import dungeonmania.entities.enemies.movement.TrackPlayer;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public class Mercenary extends HumanoidEnemy implements Interactable {
    public static final int DEFAULT_BRIBE_AMOUNT = 1;
    public static final int DEFAULT_BRIBE_RADIUS = 1;
    public static final double DEFAULT_ATTACK = 5.0;
    public static final double DEFAULT_HEALTH = 10.0;

    private int bribeAmount = Mercenary.DEFAULT_BRIBE_AMOUNT;
    private int bribeRadius = Mercenary.DEFAULT_BRIBE_RADIUS;

    private double allyAttack;
    private double allyDefence;
    private boolean allied = false;
    private boolean isAdjacentToPlayer = false;
    private boolean mindControlled = false;
    private int mindControlledDuration = 0;

    public Mercenary(Position position, double health, double attack, int bribeAmount, int bribeRadius,
            double allyAttack, double allyDefence) {
        super(position, health, attack);
        this.bribeAmount = bribeAmount;
        this.bribeRadius = bribeRadius;
        this.allyAttack = allyAttack;
        this.allyDefence = allyDefence;
    }

    public boolean isAllied() {
        return allied;
    }

    @Override
    public void onOverlap(GameMap map, Entity entity) {
        if (allied)
            return;
        super.onOverlap(map, entity);
    }

    /**
     * check whether the current merc can be bribed
     * @param player
     * @return
     */
    private boolean canBeBribed(Player player) {
        return bribeRadius >= 0 && player.countEntityOfType(Treasure.class) >= bribeAmount;
    }

    /**
     * bribe the merc
     */
    private void bribe(Player player) {
        for (int i = 0; i < bribeAmount; i++) {
            player.use(Treasure.class);
        }

    }

    @Override
    public void interact(Player player, Game game) {
        if (canBeBribed(player)) {
            allied = true;
            bribe(player);
            if (!isAdjacentToPlayer && Position.isAdjacent(player.getPosition(), getPosition()))
                isAdjacentToPlayer = true;
            game.addDefeatedEnemy();
        } else {
            allied = true;
            if (!isAdjacentToPlayer && Position.isAdjacent(player.getPosition(), getPosition()))
                isAdjacentToPlayer = true;
            mindControlledDuration = player.getMindControlledDuration();
            mindControlled = true;
        }
    }

    public boolean getIsAdjacentToPlayer() {
        return isAdjacentToPlayer;
    }

    public void setIsAdjacentToPlayer(boolean isAdjacentToPlayer) {
        this.isAdjacentToPlayer = isAdjacentToPlayer;
    }

    @Override
    public void move(Game game) {
        GameMap map = game.getMap();
        if (allied) {
            setMovementAlgorithm(new AlliedMovement());
        } else if (map.getPlayerEffectivePotion() instanceof InvisibilityPotion) {
            setMovementAlgorithm(new RandomMovement());
        } else if (map.getPlayerEffectivePotion() instanceof InvincibilityPotion) {
            setMovementAlgorithm(new EscapeMovement());
        } else {
            // Follow hostile
            setMovementAlgorithm(new TrackPlayer());
        }
        super.move(game);

        if (mindControlled) {
            mindControlledDuration--;
            if (mindControlledDuration == 0) {
                mindControlled = false;
                isAdjacentToPlayer = false;
                allied = false;
            }
        }
    }

    @Override
    public boolean isInteractable(Player player) {
        return !allied && canBeBribed(player) || player.hasSceptre();
    }

    @Override
    public BattleStatistics getBattleStatistics() {
        if (!allied) {
            return super.getBattleStatistics();
        }

        return new BattleStatistics(0, allyAttack, allyDefence, 1, 1);
    }
}
