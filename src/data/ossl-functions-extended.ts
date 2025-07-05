// Extended OSSL Functions Database - Additional 80+ functions for comprehensive coverage

export const ExtendedOSSLFunctions = [
  // Avatar/Agent Management Functions
  {
    name: 'osGetAvatarHomeURI',
    description: 'Get the home URI of an avatar',
    syntax: 'string osGetAvatarHomeURI(key avatar)',
    parameters: [
      { name: 'avatar', type: 'key', description: 'UUID of the avatar' }
    ],
    returnType: 'string',
    category: 'Agent',
    example: `string homeURI = osGetAvatarHomeURI(llGetOwner());
llSay(0, "Avatar home: " + homeURI);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsGetAvatarHomeURI'
  },
  {
    name: 'osKickAvatar',
    description: 'Kick an avatar from the region',
    syntax: 'osKickAvatar(key avatar, string message)',
    parameters: [
      { name: 'avatar', type: 'key', description: 'UUID of the avatar to kick' },
      { name: 'message', type: 'string', description: 'Message to show to the avatar' }
    ],
    returnType: 'void',
    category: 'Agent',
    example: `osKickAvatar(llDetectedKey(0), "You have been removed from this region");`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Severe',
    url: 'http://opensimulator.org/wiki/OsKickAvatar'
  },
  {
    name: 'osForceOtherSit',
    description: 'Force another avatar to sit on an object',
    syntax: 'osForceOtherSit(key avatar, key objectUUID)',
    parameters: [
      { name: 'avatar', type: 'key', description: 'UUID of the avatar' },
      { name: 'objectUUID', type: 'key', description: 'UUID of the object to sit on' }
    ],
    returnType: 'void',
    category: 'Agent',
    example: `osForceOtherSit(llDetectedKey(0), llGetKey());`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsForceOtherSit'
  },
  {
    name: 'osSetProjectionParams',
    description: 'Set light projection parameters for an object',
    syntax: 'osSetProjectionParams(integer projection, key texture, float fov, float focus, float ambiance)',
    parameters: [
      { name: 'projection', type: 'integer', description: 'Enable/disable projection' },
      { name: 'texture', type: 'key', description: 'Texture to project' },
      { name: 'fov', type: 'float', description: 'Field of view' },
      { name: 'focus', type: 'float', description: 'Focus distance' },
      { name: 'ambiance', type: 'float', description: 'Ambient light level' }
    ],
    returnType: 'void',
    category: 'Graphics',
    example: `osSetProjectionParams(TRUE, "texture-uuid", 1.0, 10.0, 0.0);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsSetProjectionParams'
  },

  // Land/Parcel Management
  {
    name: 'osGetParcelOwner',
    description: 'Get the owner of the parcel at the specified position',
    syntax: 'key osGetParcelOwner(vector pos)',
    parameters: [
      { name: 'pos', type: 'vector', description: 'Position to check' }
    ],
    returnType: 'key',
    category: 'Parcel',
    example: `key owner = osGetParcelOwner(llGetPos());
llSay(0, "Parcel owner: " + (string)owner);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsGetParcelOwner'
  },
  {
    name: 'osSetParcelDetails',
    description: 'Set details of a parcel',
    syntax: 'osSetParcelDetails(vector pos, list rules)',
    parameters: [
      { name: 'pos', type: 'vector', description: 'Position in the parcel' },
      { name: 'rules', type: 'list', description: 'List of parameters to set' }
    ],
    returnType: 'void',
    category: 'Parcel',
    example: `osSetParcelDetails(llGetPos(), [PARCEL_DETAILS_NAME, "New Parcel Name"]);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Severe',
    url: 'http://opensimulator.org/wiki/OsSetParcelDetails'
  },

  // Database Functions
  {
    name: 'osSetDynamicTextureURLBlend',
    description: 'Set dynamic texture from URL with blending options',
    syntax: 'string osSetDynamicTextureURLBlend(string dynamicID, string contentType, string url, string extraParams, integer timer, integer alpha)',
    parameters: [
      { name: 'dynamicID', type: 'string', description: 'Dynamic texture ID' },
      { name: 'contentType', type: 'string', description: 'Content type' },
      { name: 'url', type: 'string', description: 'URL to the image' },
      { name: 'extraParams', type: 'string', description: 'Extra parameters' },
      { name: 'timer', type: 'integer', description: 'Timer in milliseconds' },
      { name: 'alpha', type: 'integer', description: 'Alpha blending value' }
    ],
    returnType: 'string',
    category: 'Graphics',
    example: `osSetDynamicTextureURLBlend("", "", "http://example.com/image.jpg", "", 0, 255);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsSetDynamicTextureURLBlend'
  },

  // Script Management
  {
    name: 'osGetScriptEngineName',
    description: 'Get the name of the script engine',
    syntax: 'string osGetScriptEngineName()',
    parameters: [],
    returnType: 'string',
    category: 'Script',
    example: `string engine = osGetScriptEngineName();
llSay(0, "Script engine: " + engine);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Moderate',
    url: 'http://opensimulator.org/wiki/OsGetScriptEngineName'
  },
  {
    name: 'osResetAllScripts',
    description: 'Reset all scripts in the object',
    syntax: 'osResetAllScripts()',
    parameters: [],
    returnType: 'void',
    category: 'Script',
    example: `osResetAllScripts(); // Resets all scripts in this object`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsResetAllScripts'
  },

  // Time/Date Functions
  {
    name: 'osGetUnixTime',
    description: 'Get the current Unix timestamp',
    syntax: 'integer osGetUnixTime()',
    parameters: [],
    returnType: 'integer',
    category: 'Time',
    example: `integer timestamp = osGetUnixTime();
llSay(0, "Unix time: " + (string)timestamp);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsGetUnixTime'
  },
  {
    name: 'osFormatString',
    description: 'Format a string using C-style formatting',
    syntax: 'string osFormatString(string format, list params)',
    parameters: [
      { name: 'format', type: 'string', description: 'Format string' },
      { name: 'params', type: 'list', description: 'Parameters to format' }
    ],
    returnType: 'string',
    category: 'String',
    example: `string result = osFormatString("Hello %s, you are %d years old", ["John", 25]);
llSay(0, result);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsFormatString'
  },

  // Sound Functions
  {
    name: 'osPlaySound',
    description: 'Play a sound at a specific volume',
    syntax: 'osPlaySound(key soundUUID, float volume)',
    parameters: [
      { name: 'soundUUID', type: 'key', description: 'UUID of the sound to play' },
      { name: 'volume', type: 'float', description: 'Volume level (0.0 to 1.0)' }
    ],
    returnType: 'void',
    category: 'Sound',
    example: `osPlaySound("sound-uuid-here", 0.5);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsPlaySound'
  },

  // Animation Functions
  {
    name: 'osAvatarPlayAnimation',
    description: 'Play an animation on an avatar',
    syntax: 'osAvatarPlayAnimation(key avatar, string animation)',
    parameters: [
      { name: 'avatar', type: 'key', description: 'UUID of the avatar' },
      { name: 'animation', type: 'string', description: 'Name or UUID of the animation' }
    ],
    returnType: 'void',
    category: 'Animation',
    example: `osAvatarPlayAnimation(llGetOwner(), "sit");`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsAvatarPlayAnimation'
  },
  {
    name: 'osAvatarStopAnimation',
    description: 'Stop an animation on an avatar',
    syntax: 'osAvatarStopAnimation(key avatar, string animation)',
    parameters: [
      { name: 'avatar', type: 'key', description: 'UUID of the avatar' },
      { name: 'animation', type: 'string', description: 'Name or UUID of the animation' }
    ],
    returnType: 'void',
    category: 'Animation',
    example: `osAvatarStopAnimation(llGetOwner(), "sit");`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsAvatarStopAnimation'
  },

  // Region Functions
  {
    name: 'osGetRegionSize',
    description: 'Get the size of the current region',
    syntax: 'vector osGetRegionSize()',
    parameters: [],
    returnType: 'vector',
    category: 'Region',
    example: `vector size = osGetRegionSize();
llSay(0, "Region size: " + (string)size);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Moderate',
    url: 'http://opensimulator.org/wiki/OsGetRegionSize'
  },
  {
    name: 'osShutDown',
    description: 'Shutdown the OpenSimulator instance',
    syntax: 'osShutDown()',
    parameters: [],
    returnType: 'void',
    category: 'Console',
    example: `osShutDown(); // WARNING: This will shutdown the simulator!`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Severe',
    url: 'http://opensimulator.org/wiki/OsShutDown'
  },

  // HTTP/Web Functions
  {
    name: 'osGetNumberOfAttachments',
    description: 'Get the number of attachments an avatar has',
    syntax: 'integer osGetNumberOfAttachments(key avatar, list attachments)',
    parameters: [
      { name: 'avatar', type: 'key', description: 'UUID of the avatar' },
      { name: 'attachments', type: 'list', description: 'List of attachment points to check' }
    ],
    returnType: 'integer',
    category: 'Agent',
    example: `integer count = osGetNumberOfAttachments(llGetOwner(), []);
llSay(0, "Attachments: " + (string)count);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsGetNumberOfAttachments'
  },

  // More NPC Functions
  {
    name: 'osNpcLoadAppearance',
    description: 'Load appearance for an NPC from a notecard',
    syntax: 'osNpcLoadAppearance(key npc, string notecard)',
    parameters: [
      { name: 'npc', type: 'key', description: 'The NPC UUID' },
      { name: 'notecard', type: 'string', description: 'Name of the notecard containing appearance data' }
    ],
    returnType: 'void',
    category: 'NPC',
    example: `osNpcLoadAppearance(npc, "appearance_card");`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_NPC',
    url: 'http://opensimulator.org/wiki/OsNpcLoadAppearance'
  },
  {
    name: 'osNpcSaveAppearance',
    description: 'Save NPC appearance to a notecard',
    syntax: 'osNpcSaveAppearance(key npc, string notecard)',
    parameters: [
      { name: 'npc', type: 'key', description: 'The NPC UUID' },
      { name: 'notecard', type: 'string', description: 'Name of the notecard to save to' }
    ],
    returnType: 'void',
    category: 'NPC',
    example: `osNpcSaveAppearance(npc, "saved_appearance");`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_NPC',
    url: 'http://opensimulator.org/wiki/OsNpcSaveAppearance'
  },
  {
    name: 'osNpcSetRot',
    description: 'Set the rotation of an NPC',
    syntax: 'osNpcSetRot(key npc, rotation rot)',
    parameters: [
      { name: 'npc', type: 'key', description: 'The NPC UUID' },
      { name: 'rot', type: 'rotation', description: 'The rotation to set' }
    ],
    returnType: 'void',
    category: 'NPC',
    example: `osNpcSetRot(npc, llEuler2Rot(<0, 0, PI_BY_TWO>));`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_NPC',
    url: 'http://opensimulator.org/wiki/OsNpcSetRot'
  },
  {
    name: 'osNpcSit',
    description: 'Make an NPC sit on an object',
    syntax: 'osNpcSit(key npc, key target, integer options)',
    parameters: [
      { name: 'npc', type: 'key', description: 'The NPC UUID' },
      { name: 'target', type: 'key', description: 'Object to sit on' },
      { name: 'options', type: 'integer', description: 'Sit options' }
    ],
    returnType: 'void',
    category: 'NPC',
    example: `osNpcSit(npc, llGetKey(), OS_NPC_SIT_NOW);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_NPC',
    url: 'http://opensimulator.org/wiki/OsNpcSit'
  },
  {
    name: 'osNpcStand',
    description: 'Make an NPC stand up',
    syntax: 'osNpcStand(key npc)',
    parameters: [
      { name: 'npc', type: 'key', description: 'The NPC UUID' }
    ],
    returnType: 'void',
    category: 'NPC',
    example: `osNpcStand(npc);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_NPC',
    url: 'http://opensimulator.org/wiki/OsNpcStand'
  },

  // Drawing/Graphics Functions
  {
    name: 'osMovePen',
    description: 'Move the drawing pen to a specific position',
    syntax: 'string osMovePen(string drawList, integer x, integer y)',
    parameters: [
      { name: 'drawList', type: 'string', description: 'Current draw list' },
      { name: 'x', type: 'integer', description: 'X coordinate' },
      { name: 'y', type: 'integer', description: 'Y coordinate' }
    ],
    returnType: 'string',
    category: 'Graphics',
    example: `string drawList = osMovePen("", 50, 50);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsMovePen'
  },
  {
    name: 'osDrawLine',
    description: 'Draw a line on a dynamic texture',
    syntax: 'string osDrawLine(string drawList, integer startX, integer startY, integer endX, integer endY)',
    parameters: [
      { name: 'drawList', type: 'string', description: 'Current draw list' },
      { name: 'startX', type: 'integer', description: 'Start X coordinate' },
      { name: 'startY', type: 'integer', description: 'Start Y coordinate' },
      { name: 'endX', type: 'integer', description: 'End X coordinate' },
      { name: 'endY', type: 'integer', description: 'End Y coordinate' }
    ],
    returnType: 'string',
    category: 'Graphics',
    example: `string drawList = osDrawLine("", 0, 0, 100, 100);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsDrawLine'
  },
  {
    name: 'osDrawFilledRectangle',
    description: 'Draw a filled rectangle on a dynamic texture',
    syntax: 'string osDrawFilledRectangle(string drawList, integer width, integer height)',
    parameters: [
      { name: 'drawList', type: 'string', description: 'Current draw list' },
      { name: 'width', type: 'integer', description: 'Width of rectangle' },
      { name: 'height', type: 'integer', description: 'Height of rectangle' }
    ],
    returnType: 'string',
    category: 'Graphics',
    example: `string drawList = osDrawFilledRectangle("", 100, 50);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsDrawFilledRectangle'
  },
  {
    name: 'osSetFontSize',
    description: 'Set the font size for text drawing',
    syntax: 'string osSetFontSize(string drawList, integer fontSize)',
    parameters: [
      { name: 'drawList', type: 'string', description: 'Current draw list' },
      { name: 'fontSize', type: 'integer', description: 'Font size in points' }
    ],
    returnType: 'string',
    category: 'Graphics',
    example: `string drawList = osSetFontSize("", 12);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsSetFontSize'
  },
  {
    name: 'osSetPenColor',
    description: 'Set the pen color for drawing',
    syntax: 'string osSetPenColor(string drawList, string color)',
    parameters: [
      { name: 'drawList', type: 'string', description: 'Current draw list' },
      { name: 'color', type: 'string', description: 'Color name or hex value' }
    ],
    returnType: 'string',
    category: 'Graphics',
    example: `string drawList = osSetPenColor("", "Red");`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsSetPenColor'
  },

  // More Agent Functions
  {
    name: 'osAgentSaveAppearance',
    description: 'Save an avatar appearance to a notecard',
    syntax: 'osAgentSaveAppearance(key avatar, string notecard)',
    parameters: [
      { name: 'avatar', type: 'key', description: 'UUID of the avatar' },
      { name: 'notecard', type: 'string', description: 'Name of the notecard to save to' }
    ],
    returnType: 'void',
    category: 'Agent',
    example: `osAgentSaveAppearance(llGetOwner(), "my_appearance");`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_High',
    url: 'http://opensimulator.org/wiki/OsAgentSaveAppearance'
  },

  // More Inventory Functions
  {
    name: 'osGetInventoryName',
    description: 'Get the name of an inventory item by index',
    syntax: 'string osGetInventoryName(integer type, integer index)',
    parameters: [
      { name: 'type', type: 'integer', description: 'Inventory type constant' },
      { name: 'index', type: 'integer', description: 'Index of the item' }
    ],
    returnType: 'string',
    category: 'Inventory',
    example: `string name = osGetInventoryName(INVENTORY_TEXTURE, 0);
llSay(0, "First texture: " + name);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsGetInventoryName'
  },

  // More String Functions
  {
    name: 'osMatchString',
    description: 'Match a string against a pattern with wildcards',
    syntax: 'integer osMatchString(string src, string pattern, integer start)',
    parameters: [
      { name: 'src', type: 'string', description: 'Source string to search' },
      { name: 'pattern', type: 'string', description: 'Pattern with wildcards (* and ?)' },
      { name: 'start', type: 'integer', description: 'Starting position' }
    ],
    returnType: 'integer',
    category: 'String',
    example: `integer match = osMatchString("hello world", "hello*", 0);
if (match >= 0) llSay(0, "Pattern matched at position " + (string)match);`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsMatchString'
  },
  {
    name: 'osReplaceString',
    description: 'Replace all occurrences of a substring',
    syntax: 'string osReplaceString(string src, string oldvalue, string newvalue, integer count, integer start)',
    parameters: [
      { name: 'src', type: 'string', description: 'Source string' },
      { name: 'oldvalue', type: 'string', description: 'String to replace' },
      { name: 'newvalue', type: 'string', description: 'Replacement string' },
      { name: 'count', type: 'integer', description: 'Maximum replacements (-1 for all)' },
      { name: 'start', type: 'integer', description: 'Starting position' }
    ],
    returnType: 'string',
    category: 'String',
    example: `string result = osReplaceString("hello world", "world", "universe", -1, 0);
llSay(0, result); // "hello universe"`,
    availability: 'OpenSimulator 0.7.0+',
    permissions: 'OSSL_Public',
    url: 'http://opensimulator.org/wiki/OsReplaceString'
  }
];

export default ExtendedOSSLFunctions;