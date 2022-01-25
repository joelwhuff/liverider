import CameraTool from '../tool/CameraTool.js';
import EmptyTool from '../tool/EmptyTool.js';
import BombTool from '../tool/item/BombTool.js';
import CheckpointTool from '../tool/item/CheckpointTool.js';
import SlowMoTool from '../tool/item/SlowMoTool.js';
import TargetTool from '../tool/item/TargetTool.js';
import BoostTool from '../tool/item/BoostTool.js';
import GravityTool from '../tool/item/GravityTool.js';
import FullscreenTool from '../tool/FullscreenTool.js';
import EraserTool from '../tool/EraserTool.js';
import PauseTool from '../tool/PauseTool.js';
import RestartTool from '../tool/RestartTool.js';
import CancelCheckpointTool from '../tool/CancelCheckpointTool.js';
import UndoTool from '../tool/UndoTool.js';
import RedoTool from '../tool/RedoTool.js';
import LineTool from '../tool/item/line/LineTool.js';
import BrushTool from '../tool/item/line/BrushTool.js';
import GridSnapTool from '../tool/GridSnapTool.js';
import SwitchBikeTool from '../tool/SwitchBikeTool.js';
import FocusGhostTool from '../tool/FocusGhostTool.js';
import StartPositionTool from '../tool/StartPositionTool.js';
import ItemSelectorTool from '../tool/item/ItemSelectorTool.js';

export const LEFT_TOOLBAR_VIEWING = [
        PauseTool,
        RestartTool,
        CancelCheckpointTool,
        EmptyTool,
        SwitchBikeTool,
        FocusGhostTool,
        EmptyTool,
        CameraTool,
        // FullscreenTool,
    ],
    LEFT_TOOLBAR_EDITING = [
        PauseTool,
        RestartTool,
        CancelCheckpointTool,
        EmptyTool,
        SwitchBikeTool,
        // FocusGhostTool,
        // EmptyTool,
        // FullscreenTool,
        EmptyTool,
        UndoTool,
        RedoTool,
    ],
    RIGHT_TOOLBAR = [
        LineTool,
        BrushTool,
        ItemSelectorTool,
        EraserTool,
        // EmptyTool,
        CameraTool,
        StartPositionTool,
        EmptyTool,
        //TargetTool,
        //CheckpointTool,
        //BoostTool,
        //GravityTool,
        //BombTool,
        //SlowMoTool,
        // EmptyTool,
        GridSnapTool,
    ],
    ITEM_OPTIONS = [TargetTool, CheckpointTool, BoostTool, GravityTool, BombTool, SlowMoTool];
