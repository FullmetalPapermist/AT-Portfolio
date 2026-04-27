package dungeonmania.goals;

import dungeonmania.Game;
import dungeonmania.entities.Switch;

public class GoalBoulder implements Goal {
    @Override
    public boolean achieved(Game game) {
        if (game.getPlayer() == null)
            return false;
        return game.getMapEntities(Switch.class).stream().allMatch(s -> s.isActivated());

    }

    @Override
    public String toString(Game game) {
        if (this.achieved(game))
            return "";
        return ":boulders";
    }

}
