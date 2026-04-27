package dungeonmania.entities.buildables;

import dungeonmania.battles.BattleStatistics;
import dungeonmania.entities.BattleItem;

public class MidnightArmour extends Buildable implements BattleItem {
    private int midnightArmourAttack;
    private int midnightArmourDefence;

    public MidnightArmour(int midnightArmourAttack, int midnightArmourDefence) {
        this.midnightArmourAttack = midnightArmourAttack;
        this.midnightArmourDefence = midnightArmourDefence;
    }

    @Override
    public BattleStatistics applyBuff(BattleStatistics origin) {
        return new BattleStatistics(0, midnightArmourAttack, midnightArmourDefence, 1, 1);
    }

}
