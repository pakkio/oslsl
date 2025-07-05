// Test LSL script for enhanced semantic analysis

default {
    state_entry() {
        llSay(0, "Hello World!");
        llSetText("Enhanced LSL Server", <1,1,1>, 1.0);
        llSetTimerEvent(5.0);
    }
    
    timer() {
        vector pos = llGetPos();
        rotation rot = llGetRot();
        llSay(0, "Position: " + (string)pos);
        llSay(0, "Rotation: " + (string)rot);
    }
    
    touch_start(integer total_number) {
        llSay(0, "Touched by " + (string)total_number + " avatars");
        llApplyImpulse(<0,0,10>, FALSE);
    }
    
    collision_start(integer num_detected) {
        llSay(0, "Collision detected!");
        llSetText("Collision!", <1,0,0>, 1.0);
    }
}