package dungeonmania.goals;

import dungeonmania.Game;

public class GoalTreasure implements Goal {
    private int target;

    protected GoalTreasure(int target) {
        this.target = target;
    }

    @Override
    public boolean achieved(Game game) {
        if (game.getPlayer() == null)
            return false;

        return game.getCollectedTreasureCount() >= target;

    }

    @Override
    public String toString(Game game) {
        if (achieved(game))
            return "";

        return ":treasure";
    }

}
