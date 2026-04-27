package dungeonmania.goals;

import java.util.List;

import dungeonmania.Game;
import dungeonmania.entities.Exit;
import dungeonmania.entities.PositionEntity;
import dungeonmania.util.Position;

public class GoalExit implements Goal {
    @Override
    public boolean achieved(Game game) {
        if (game.getPlayer() == null)
            return false;

        Position pos = game.getPlayerPosition();
        List<Exit> es = game.getMapEntities(Exit.class);
        if (es == null || es.size() == 0)
            return false;

        return es.stream().map(PositionEntity::getPosition).anyMatch(pos::equals);

    }

    @Override
    public String toString(Game game) {
        if (this.achieved(game))
            return "";

        return ":exit";
    }

}
