package dungeonmania.goals;

import dungeonmania.Game;

public class GoalEnemy implements Goal {
    private int enemyGoal;

    public GoalEnemy(int enemyGoal) {
        this.enemyGoal = enemyGoal;
    }

    @Override
    public boolean achieved(Game game) {
        if (game.getSpawners() == 0 && game.getDefeatedEnemies() >= enemyGoal)
            return true;
        return false;
    }

    @Override
    public String toString(Game game) {
        if (achieved(game)) {
            return "";
        }

        return ":enemies";
    }

}
