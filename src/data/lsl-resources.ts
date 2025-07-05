export class LSLResources {
  static getGitHubRepositories() {
    return [
      {
        name: 'Outworldz/LSL-Scripts',
        url: 'https://github.com/Outworldz/LSL-Scripts',
        description: 'Free LSL Scripts for Second Life and Opensim - 294 scripts by Ferd Frederix',
        platform: ['secondlife', 'opensim'],
        stars: 'Popular',
        license: 'Free/Open Source',
      },
      {
        name: 'peterhost/lsl-library',
        url: 'https://github.com/peterhost/lsl-library',
        description: 'Library of scripts and snippets in LSL and OSSL for Opensim and Second Life',
        platform: ['secondlife', 'opensim'],
        features: ['LSL', 'OSSL', 'snippets'],
        license: 'Various open source licenses',
      },
      {
        name: 'jdroo/LSL-Scripts',
        url: 'https://github.com/jdroo/LSL-Scripts',
        description: 'Free LSL Scripts for Second Life and Opensim with LSL-Editor format',
        platform: ['secondlife', 'opensim'],
        features: ['LSL-Editor format', 'images', 'CAD files'],
        license: 'Free',
      },
      {
        name: 'Furbrained/SecondLife-Scripts',
        url: 'https://github.com/Furbrained/SecondLife-Scripts',
        description: 'Collection of Second Life and Opensim LSL Scripts organized by project',
        platform: ['secondlife', 'opensim'],
        features: ['organized by project', 'simple scripts'],
        license: 'Free',
      },
      {
        name: 'dazzle-lsl/LSL-Scripts',
        url: 'https://github.com/second-life/LSL-Scripts',
        description: 'Free LSL Scripts for Second Life and Opensim',
        platform: ['secondlife', 'opensim'],
        license: 'Free',
      },
    ];
  }

  static getCommonLSLFunctions() {
    return [
      {
        name: 'llSay',
        description: 'Speaks text on the specified channel',
        syntax: 'llSay(integer channel, string text)',
        category: 'Communication',
        url: 'https://wiki.secondlife.com/wiki/LlSay',
      },
      {
        name: 'llListen',
        description: 'Sets up a listener for chat messages',
        syntax: 'integer llListen(integer channel, string name, key id, string msg)',
        category: 'Communication',
        url: 'https://wiki.secondlife.com/wiki/LlListen',
      },
      {
        name: 'llSetTimer',
        description: 'Sets a timer event to occur every specified seconds',
        syntax: 'llSetTimer(float seconds)',
        category: 'Time',
        url: 'https://wiki.secondlife.com/wiki/LlSetTimer',
      },
      {
        name: 'llDetectedKey',
        description: 'Returns the key of the detected object',
        syntax: 'key llDetectedKey(integer index)',
        category: 'Detection',
        url: 'https://wiki.secondlife.com/wiki/LlDetectedKey',
      },
      {
        name: 'llGetOwner',
        description: 'Returns the key of the owner of the object',
        syntax: 'key llGetOwner()',
        category: 'Object',
        url: 'https://wiki.secondlife.com/wiki/LlGetOwner',
      },
      {
        name: 'llHTTPRequest',
        description: 'Sends an HTTP request to a URL',
        syntax: 'key llHTTPRequest(string url, list parameters, string body)',
        category: 'HTTP',
        url: 'https://wiki.secondlife.com/wiki/LlHTTPRequest',
      },
      {
        name: 'llRezObject',
        description: 'Instantiates an object from inventory',
        syntax: 'llRezObject(string inventory, vector pos, vector vel, rotation rot, integer param)',
        category: 'Object',
        url: 'https://wiki.secondlife.com/wiki/LlRezObject',
      },
      {
        name: 'llSensor',
        description: 'Performs a sensor scan for objects or avatars',
        syntax: 'llSensor(string name, key id, integer type, float range, float arc)',
        category: 'Sensor',
        url: 'https://wiki.secondlife.com/wiki/LlSensor',
      },
    ];
  }

  static getCommonLSLEvents() {
    return [
      {
        name: 'state_entry',
        description: 'Triggered when the script starts or changes state',
        syntax: 'state_entry()',
        category: 'State',
        url: 'https://wiki.secondlife.com/wiki/State_entry',
      },
      {
        name: 'touch_start',
        description: 'Triggered when an agent starts touching the object',
        syntax: 'touch_start(integer total_number)',
        category: 'Touch',
        url: 'https://wiki.secondlife.com/wiki/Touch_start',
      },
      {
        name: 'listen',
        description: 'Triggered when a message is received on a listened channel',
        syntax: 'listen(integer channel, string name, key id, string message)',
        category: 'Communication',
        url: 'https://wiki.secondlife.com/wiki/Listen',
      },
      {
        name: 'timer',
        description: 'Triggered when a timer event occurs',
        syntax: 'timer()',
        category: 'Time',
        url: 'https://wiki.secondlife.com/wiki/Timer',
      },
      {
        name: 'collision_start',
        description: 'Triggered when the object starts colliding with another object',
        syntax: 'collision_start(integer num_detected)',
        category: 'Collision',
        url: 'https://wiki.secondlife.com/wiki/Collision_start',
      },
      {
        name: 'http_response',
        description: 'Triggered when an HTTP request receives a response',
        syntax: 'http_response(key request_id, integer status, list metadata, string body)',
        category: 'HTTP',
        url: 'https://wiki.secondlife.com/wiki/Http_response',
      },
      {
        name: 'sensor',
        description: 'Triggered when a sensor scan detects objects or avatars',
        syntax: 'sensor(integer number)',
        category: 'Sensor',
        url: 'https://wiki.secondlife.com/wiki/Sensor',
      },
      {
        name: 'no_sensor',
        description: 'Triggered when a sensor scan finds nothing',
        syntax: 'no_sensor()',
        category: 'Sensor',
        url: 'https://wiki.secondlife.com/wiki/No_sensor',
      },
    ];
  }

  static getCommonLSLConstants() {
    return [
      {
        name: 'TRUE',
        value: '1',
        description: 'Boolean true value',
        category: 'Boolean',
      },
      {
        name: 'FALSE',
        value: '0',
        description: 'Boolean false value',
        category: 'Boolean',
      },
      {
        name: 'PUBLIC_CHANNEL',
        value: '0',
        description: 'Public chat channel',
        category: 'Communication',
      },
      {
        name: 'AGENT',
        value: '0x1',
        description: 'Avatar type for sensor functions',
        category: 'Sensor',
      },
      {
        name: 'ACTIVE',
        value: '0x2',
        description: 'Active object type for sensor functions',
        category: 'Sensor',
      },
      {
        name: 'PASSIVE',
        value: '0x4',
        description: 'Passive object type for sensor functions',
        category: 'Sensor',
      },
      {
        name: 'SCRIPTED',
        value: '0x8',
        description: 'Scripted object type for sensor functions',
        category: 'Sensor',
      },
    ];
  }

  static getCommonOSSLFunctions() {
    return [
      {
        name: 'osTeleportAgent',
        description: 'Teleports an agent to another position and region',
        syntax: 'osTeleportAgent(key agent, string regionName, vector position, vector lookAt)',
        category: 'Agent',
        url: 'http://opensimulator.org/wiki/OsTeleportAgent',
      },
      {
        name: 'osConsoleCommand',
        description: 'Executes a console command on the server',
        syntax: 'osConsoleCommand(string command)',
        category: 'Console',
        url: 'http://opensimulator.org/wiki/OsConsoleCommand',
      },
      {
        name: 'osSetSpeed',
        description: 'Sets the speed of an avatar',
        syntax: 'osSetSpeed(key avatar, float speed)',
        category: 'Agent',
        url: 'http://opensimulator.org/wiki/OsSetSpeed',
      },
      {
        name: 'osGetRegionStats',
        description: 'Gets statistics about the current region',
        syntax: 'list osGetRegionStats()',
        category: 'Region',
        url: 'http://opensimulator.org/wiki/OsGetRegionStats',
      },
      {
        name: 'osNpcCreate',
        description: 'Creates an NPC (Non-Player Character)',
        syntax: 'key osNpcCreate(string firstname, string lastname, vector position, string notecard)',
        category: 'NPC',
        url: 'http://opensimulator.org/wiki/OsNpcCreate',
      },
      {
        name: 'osDrawText',
        description: 'Draws text on a dynamic texture',
        syntax: 'string osDrawText(string drawList, string text)',
        category: 'Graphics',
        url: 'http://opensimulator.org/wiki/OsDrawText',
      },
    ];
  }

  static getBestPractices(category: string) {
    const practices: { [key: string]: any } = {
      performance: [
        {
          title: 'Minimize Timer Usage',
          description: 'Use timers sparingly and always call llSetTimer(0.0) when finished to stop the timer.',
          examples: '// Good\nllSetTimer(1.0);\n// In timer event:\nllSetTimer(0.0); // Stop when done\n\n// Bad\n// Leaving timers running unnecessarily',
        },
        {
          title: 'Efficient Sensor Usage',
          description: 'Use llSensorRepeat carefully and always call llSensorRemove() when finished.',
          examples: '// Good\nllSensorRepeat("", NULL_KEY, AGENT, 10.0, PI, 2.0);\n// Later:\nllSensorRemove();\n\n// Bad\n// Multiple overlapping sensors',
        },
        {
          title: 'Optimize String Operations',
          description: 'String operations are expensive. Cache results and avoid repeated concatenation.',
          examples: '// Good\nstring cached = "Hello " + name;\nllSay(0, cached);\n\n// Bad\nllSay(0, "Hello " + name + "!");\nllSay(0, "Hello " + name + "?");',
        },
      ],
      security: [
        {
          title: 'Validate User Input',
          description: 'Always validate and sanitize input from users before processing.',
          examples: '// Good\nif (llStringLength(message) > 100) return;\nif (llSubStringIndex(message, "http://") != -1) return;\n\n// Bad\n// Processing user input without validation',
        },
        {
          title: 'Use Owner-Only Functions Carefully',
          description: 'Restrict dangerous functions to object owner only.',
          examples: '// Good\nif (llDetectedKey(0) == llGetOwner()) {\n    // Safe to execute dangerous function\n}\n\n// Bad\n// Allowing anyone to trigger dangerous functions',
        },
      ],
      memory: [
        {
          title: 'Minimize Global Variables',
          description: 'Use local variables when possible to reduce memory usage.',
          examples: '// Good\ndefault {\n    state_entry() {\n        integer local_var = 42;\n        // Use local_var\n    }\n}\n\n// Bad\ninteger global_var; // Only if needed across events',
        },
        {
          title: 'Clean Up Listeners',
          description: 'Remove listeners when they are no longer needed.',
          examples: '// Good\ninteger listener;\nlistener = llListen(0, "", NULL_KEY, "");\n// Later:\nllListenRemove(listener);\n\n// Bad\n// Creating listeners without removing them',
        },
      ],
      general: [
        {
          title: 'Use Meaningful Variable Names',
          description: 'Choose descriptive names that make your code self-documenting.',
          examples: '// Good\ninteger user_count = 0;\nstring welcome_message = "Hello!";\n\n// Bad\ninteger x = 0;\nstring s = "Hello!";',
        },
        {
          title: 'Comment Your Code',
          description: 'Add comments to explain complex logic and functionality.',
          examples: '// Check if user is within range before teleporting\nif (llVecDist(llGetPos(), user_pos) < 10.0) {\n    // Teleport user to destination\n    osTeleportAgent(user, region, dest, look);\n}',
        },
        {
          title: 'Use States Appropriately',
          description: 'Organize your script logic using states for better structure.',
          examples: 'default {\n    state_entry() {\n        llSay(0, "Ready");\n    }\n    touch_start(integer total) {\n        state working;\n    }\n}\n\nstate working {\n    // Handle working state\n}',
        },
      ],
    };

    return practices[category] || practices.general;
  }
}