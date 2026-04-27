package dungeonmania.entities.enemies;

import dungeonmania.Game;
import dungeonmania.battles.BattleStatistics;
import dungeonmania.battles.Battleable;
import dungeonmania.entities.DestroyableEntity;
import dungeonmania.entities.Entity;
import dungeonmania.entities.OverlappableEntity;
import dungeonmania.entities.Player;
import dungeonmania.entities.PositionEntity;
import dungeonmania.map.GameMap;
import dungeonmania.util.Position;

public abstract class Enemy extends PositionEntity implements Battleable, DestroyableEntity, OverlappableEntity {
    public static final int CHARACTER_LAYER = 3;

    private BattleStatistics battleStatistics;

    public Enemy(Position position, double health, double attack) {
        super(position.asLayer(Entity.CHARACTER_LAYER));
        battleStatistics = new BattleStatistics(health, attack, 0, BattleStatistics.DEFAULT_DAMAGE_MAGNIFIER,
                BattleStatistics.DEFAULT_ENEMY_DAMAGE_REDUCER);
    }

    @Override
    public boolean canMoveOnto(GameMap map, Entity entity) {
        return entity instanceof Player;
    }

    @Override
    public BattleStatistics getBattleStatistics() {
        return battleStatistics;
    }

    public double getHealth() {
        return battleStatistics.getHealth();
    }

    public void setHealth(double health) {
        battleStatistics.setHealth(health);
    }

    @Override
    public void onOverlap(GameMap map, Entity entity) {
        if (entity instanceof Player) {
            Player player = (Player) entity;
            map.battle(player, this);
        }
    }

    @Override
    public void onDestroy(GameMap map) {
        Game g = map.getGame();
        g.unsubscribe(getId());
        map.addDefeatedEnemy();
    }

    public abstract void move(Game game);
}
