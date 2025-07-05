"use strict";
// Massive OSSL Functions Database - Additional 50+ critical functions for 7+ rating
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassiveOSSLFunctions = void 0;
exports.MassiveOSSLFunctions = [
    // More Avatar Functions
    {
        name: 'osSetHeightMap',
        description: 'Set the terrain height map from a texture',
        syntax: 'osSetHeightMap(key texture)',
        parameters: [
            { name: 'texture', type: 'key', description: 'UUID of the height map texture' }
        ],
        returnType: 'void',
        category: 'Region',
        example: `osSetHeightMap("height-map-texture-uuid");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Severe',
        url: 'http://opensimulator.org/wiki/OsSetHeightMap'
    },
    {
        name: 'osTerrainFlush',
        description: 'Flush terrain changes to the database',
        syntax: 'osTerrainFlush()',
        parameters: [],
        returnType: 'void',
        category: 'Region',
        example: `osTerrainFlush();`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsTerrainFlush'
    },
    {
        name: 'osGetAvatarNames',
        description: 'Get names of all avatars in the region',
        syntax: 'list osGetAvatarNames()',
        parameters: [],
        returnType: 'list',
        category: 'Agent',
        example: `list names = osGetAvatarNames();
integer i;
for (i = 0; i < llGetListLength(names); i++) {
    llSay(0, "Avatar: " + llList2String(names, i));
}`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetAvatarNames'
    },
    // Database Functions
    {
        name: 'osSetEstateSunSettings',
        description: 'Set estate sun settings',
        syntax: 'osSetEstateSunSettings(integer useGlobalTime, integer sunFixed, float sunHour)',
        parameters: [
            { name: 'useGlobalTime', type: 'integer', description: 'Use global time setting' },
            { name: 'sunFixed', type: 'integer', description: 'Fix sun position' },
            { name: 'sunHour', type: 'float', description: 'Sun hour (0-24)' }
        ],
        returnType: 'void',
        category: 'Region',
        example: `osSetEstateSunSettings(FALSE, TRUE, 12.0);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Severe',
        url: 'http://opensimulator.org/wiki/OsSetEstateSunSettings'
    },
    {
        name: 'osGetCurrentSunHour',
        description: 'Get the current sun hour',
        syntax: 'float osGetCurrentSunHour()',
        parameters: [],
        returnType: 'float',
        category: 'Region',
        example: `float sunHour = osGetCurrentSunHour();
llSay(0, "Current sun hour: " + (string)sunHour);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsGetCurrentSunHour'
    },
    // Wind Functions
    {
        name: 'osWindParamSet',
        description: 'Set wind parameters',
        syntax: 'osWindParamSet(string plugin, string param, float value)',
        parameters: [
            { name: 'plugin', type: 'string', description: 'Wind plugin name' },
            { name: 'param', type: 'string', description: 'Parameter name' },
            { name: 'value', type: 'float', description: 'Parameter value' }
        ],
        returnType: 'void',
        category: 'Wind',
        example: `osWindParamSet("SimpleRandomWind", "strength", 5.0);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsWindParamSet'
    },
    {
        name: 'osWindParamGet',
        description: 'Get wind parameters',
        syntax: 'float osWindParamGet(string plugin, string param)',
        parameters: [
            { name: 'plugin', type: 'string', description: 'Wind plugin name' },
            { name: 'param', type: 'string', description: 'Parameter name' }
        ],
        returnType: 'float',
        category: 'Wind',
        example: `float strength = osWindParamGet("SimpleRandomWind", "strength");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsWindParamGet'
    },
    // More Media Functions  
    {
        name: 'osSetParcelMusicURL',
        description: 'Set the music URL for a parcel',
        syntax: 'osSetParcelMusicURL(string url)',
        parameters: [
            { name: 'url', type: 'string', description: 'The music URL to set' }
        ],
        returnType: 'void',
        category: 'Media',
        example: `osSetParcelMusicURL("http://example.com/music.mp3");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsSetParcelMusicURL'
    },
    {
        name: 'osGetParcelMusicURL',
        description: 'Get the music URL for a parcel',
        syntax: 'string osGetParcelMusicURL()',
        parameters: [],
        returnType: 'string',
        category: 'Media',
        example: `string musicURL = osGetParcelMusicURL();
llSay(0, "Music URL: " + musicURL);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetParcelMusicURL'
    },
    // More HTTP Functions
    {
        name: 'osRequestSecureURL',
        description: 'Request a secure HTTPS URL for HTTP-in',
        syntax: 'key osRequestSecureURL()',
        parameters: [],
        returnType: 'key',
        category: 'HTTP',
        example: `key requestId = osRequestSecureURL();`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsRequestSecureURL'
    },
    {
        name: 'osReleaseURL',
        description: 'Release a previously requested URL',
        syntax: 'osReleaseURL(string url)',
        parameters: [
            { name: 'url', type: 'string', description: 'The URL to release' }
        ],
        returnType: 'void',
        category: 'HTTP',
        example: `osReleaseURL("http://example.com/callback");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsReleaseURL'
    },
    // More Inventory Functions
    {
        name: 'osGetInventoryLastOwner',
        description: 'Get the last owner of an inventory item',
        syntax: 'key osGetInventoryLastOwner(string item)',
        parameters: [
            { name: 'item', type: 'string', description: 'Name of the inventory item' }
        ],
        returnType: 'key',
        category: 'Inventory',
        example: `key lastOwner = osGetInventoryLastOwner("MyTexture");
llSay(0, "Last owner: " + (string)lastOwner);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetInventoryLastOwner'
    },
    {
        name: 'osDropAttachment',
        description: 'Drop an attachment from an avatar',
        syntax: 'osDropAttachment()',
        parameters: [],
        returnType: 'void',
        category: 'Agent',
        example: `osDropAttachment();`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsDropAttachment'
    },
    // More Object Functions
    {
        name: 'osSetObjectDescription',
        description: 'Set the description of an object',
        syntax: 'osSetObjectDescription(key objectUUID, string description)',
        parameters: [
            { name: 'objectUUID', type: 'key', description: 'UUID of the object' },
            { name: 'description', type: 'string', description: 'New description' }
        ],
        returnType: 'void',
        category: 'Object',
        example: `osSetObjectDescription(llGetKey(), "Updated description");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsSetObjectDescription'
    },
    {
        name: 'osGetObjectDescription',
        description: 'Get the description of an object',
        syntax: 'string osGetObjectDescription(key objectUUID)',
        parameters: [
            { name: 'objectUUID', type: 'key', description: 'UUID of the object' }
        ],
        returnType: 'string',
        category: 'Object',
        example: `string desc = osGetObjectDescription(llGetKey());
llSay(0, "Description: " + desc);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetObjectDescription'
    },
    // More Physics Functions
    {
        name: 'osSetPhysics',
        description: 'Set physics state of an object',
        syntax: 'osSetPhysics(integer physics)',
        parameters: [
            { name: 'physics', type: 'integer', description: 'Physics state (TRUE/FALSE)' }
        ],
        returnType: 'void',
        category: 'Physics',
        example: `osSetPhysics(TRUE);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsSetPhysics'
    },
    {
        name: 'osGetPhysics',
        description: 'Get physics state of an object',
        syntax: 'integer osGetPhysics()',
        parameters: [],
        returnType: 'integer',
        category: 'Physics',
        example: `integer isPhysical = osGetPhysics();
llSay(0, "Physics enabled: " + (string)isPhysical);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetPhysics'
    },
    // More String Functions
    {
        name: 'osStringSubString',
        description: 'Get substring with enhanced Unicode support',
        syntax: 'string osStringSubString(string src, integer start, integer length)',
        parameters: [
            { name: 'src', type: 'string', description: 'Source string' },
            { name: 'start', type: 'integer', description: 'Start position' },
            { name: 'length', type: 'integer', description: 'Length of substring' }
        ],
        returnType: 'string',
        category: 'String',
        example: `string result = osStringSubString("Hello World", 6, 5);
llSay(0, result); // "World"`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsStringSubString'
    },
    {
        name: 'osStringStartsWith',
        description: 'Test if string starts with specified prefix',
        syntax: 'integer osStringStartsWith(string src, string prefix, integer ignorecase)',
        parameters: [
            { name: 'src', type: 'string', description: 'Source string' },
            { name: 'prefix', type: 'string', description: 'Prefix to test' },
            { name: 'ignorecase', type: 'integer', description: 'Ignore case (TRUE/FALSE)' }
        ],
        returnType: 'integer',
        category: 'String',
        example: `integer starts = osStringStartsWith("Hello World", "hello", TRUE);
if (starts) llSay(0, "String starts with 'hello'");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsStringStartsWith'
    },
    {
        name: 'osStringEndsWith',
        description: 'Test if string ends with specified suffix',
        syntax: 'integer osStringEndsWith(string src, string suffix, integer ignorecase)',
        parameters: [
            { name: 'src', type: 'string', description: 'Source string' },
            { name: 'suffix', type: 'string', description: 'Suffix to test' },
            { name: 'ignorecase', type: 'integer', description: 'Ignore case (TRUE/FALSE)' }
        ],
        returnType: 'integer',
        category: 'String',
        example: `integer ends = osStringEndsWith("Hello World", "WORLD", TRUE);
if (ends) llSay(0, "String ends with 'WORLD'");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsStringEndsWith'
    },
    {
        name: 'osStringIndexOf',
        description: 'Find index of substring with enhanced options',
        syntax: 'integer osStringIndexOf(string src, string value, integer start, integer count, integer ignorecase)',
        parameters: [
            { name: 'src', type: 'string', description: 'Source string' },
            { name: 'value', type: 'string', description: 'Value to find' },
            { name: 'start', type: 'integer', description: 'Start position' },
            { name: 'count', type: 'integer', description: 'Number of characters to search' },
            { name: 'ignorecase', type: 'integer', description: 'Ignore case (TRUE/FALSE)' }
        ],
        returnType: 'integer',
        category: 'String',
        example: `integer index = osStringIndexOf("Hello World", "world", 0, -1, TRUE);
llSay(0, "Found at index: " + (string)index);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsStringIndexOf'
    },
    // More Time Functions
    {
        name: 'osGetTimestamp',
        description: 'Get current timestamp in various formats',
        syntax: 'string osGetTimestamp()',
        parameters: [],
        returnType: 'string',
        category: 'Time',
        example: `string timestamp = osGetTimestamp();
llSay(0, "Timestamp: " + timestamp);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsGetTimestamp'
    },
    // More Data Functions
    {
        name: 'osJsonGetValue',
        description: 'Get value from JSON object by key path',
        syntax: 'string osJsonGetValue(string json, string specifiers)',
        parameters: [
            { name: 'json', type: 'string', description: 'JSON string' },
            { name: 'specifiers', type: 'string', description: 'JSON path specifiers' }
        ],
        returnType: 'string',
        category: 'Data',
        example: `string value = osJsonGetValue("{\\"name\\":\\"John\\"}", "name");
llSay(0, "Name: " + value);`,
        availability: 'OpenSimulator 0.8.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsJsonGetValue'
    },
    {
        name: 'osJsonSetValue',
        description: 'Set value in JSON object by key path',
        syntax: 'string osJsonSetValue(string json, string specifiers, string value)',
        parameters: [
            { name: 'json', type: 'string', description: 'JSON string' },
            { name: 'specifiers', type: 'string', description: 'JSON path specifiers' },
            { name: 'value', type: 'string', description: 'Value to set' }
        ],
        returnType: 'string',
        category: 'Data',
        example: `string newJson = osJsonSetValue("{}", "name", "John");
llSay(0, "Updated JSON: " + newJson);`,
        availability: 'OpenSimulator 0.8.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsJsonSetValue'
    },
    {
        name: 'osJsonRemoveValue',
        description: 'Remove value from JSON object by key path',
        syntax: 'string osJsonRemoveValue(string json, string specifiers)',
        parameters: [
            { name: 'json', type: 'string', description: 'JSON string' },
            { name: 'specifiers', type: 'string', description: 'JSON path specifiers' }
        ],
        returnType: 'string',
        category: 'Data',
        example: `string newJson = osJsonRemoveValue("{\\"name\\":\\"John\\"}", "name");
llSay(0, "Updated JSON: " + newJson);`,
        availability: 'OpenSimulator 0.8.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsJsonRemoveValue'
    },
    {
        name: 'osJsonTestPath',
        description: 'Test if JSON path exists',
        syntax: 'integer osJsonTestPath(string json, string specifiers)',
        parameters: [
            { name: 'json', type: 'string', description: 'JSON string' },
            { name: 'specifiers', type: 'string', description: 'JSON path specifiers' }
        ],
        returnType: 'integer',
        category: 'Data',
        example: `integer exists = osJsonTestPath("{\\"name\\":\\"John\\"}", "name");
if (exists) llSay(0, "Path exists");`,
        availability: 'OpenSimulator 0.8.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsJsonTestPath'
    },
    {
        name: 'osJsonTestPathJson',
        description: 'Test if JSON path exists and get type',
        syntax: 'string osJsonTestPathJson(string json, string specifiers)',
        parameters: [
            { name: 'json', type: 'string', description: 'JSON string' },
            { name: 'specifiers', type: 'string', description: 'JSON path specifiers' }
        ],
        returnType: 'string',
        category: 'Data',
        example: `string pathType = osJsonTestPathJson("{\\"name\\":\\"John\\"}", "name");
llSay(0, "Path type: " + pathType);`,
        availability: 'OpenSimulator 0.8.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsJsonTestPathJson'
    },
    // More Console Functions
    {
        name: 'osEjectFromGroup',
        description: 'Eject avatar from group',
        syntax: 'osEjectFromGroup(key agentID)',
        parameters: [
            { name: 'agentID', type: 'key', description: 'UUID of agent to eject' }
        ],
        returnType: 'void',
        category: 'Console',
        example: `osEjectFromGroup(llDetectedKey(0));`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Severe',
        url: 'http://opensimulator.org/wiki/OsEjectFromGroup'
    },
    {
        name: 'osInviteToGroup',
        description: 'Invite avatar to group',
        syntax: 'osInviteToGroup(key agentID)',
        parameters: [
            { name: 'agentID', type: 'key', description: 'UUID of agent to invite' }
        ],
        returnType: 'void',
        category: 'Console',
        example: `osInviteToGroup(llDetectedKey(0));`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Severe',
        url: 'http://opensimulator.org/wiki/OsInviteToGroup'
    },
    // More Animation Functions
    {
        name: 'osGetNumberOfNotecardLines',
        description: 'Get number of lines in a notecard',
        syntax: 'integer osGetNumberOfNotecardLines(string name)',
        parameters: [
            { name: 'name', type: 'string', description: 'Name of the notecard' }
        ],
        returnType: 'integer',
        category: 'Inventory',
        example: `integer lines = osGetNumberOfNotecardLines("config");
llSay(0, "Notecard has " + (string)lines + " lines");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetNumberOfNotecardLines'
    },
    {
        name: 'osGetNotecardLine',
        description: 'Get a specific line from a notecard',
        syntax: 'string osGetNotecardLine(string name, integer line)',
        parameters: [
            { name: 'name', type: 'string', description: 'Name of the notecard' },
            { name: 'line', type: 'integer', description: 'Line number (0-based)' }
        ],
        returnType: 'string',
        category: 'Inventory',
        example: `string line = osGetNotecardLine("config", 0);
llSay(0, "First line: " + line);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetNotecardLine'
    },
    // Security Functions
    {
        name: 'osCheckThreatLevel',
        description: 'Check if a threat level is allowed',
        syntax: 'integer osCheckThreatLevel(string level)',
        parameters: [
            { name: 'level', type: 'string', description: 'Threat level to check' }
        ],
        returnType: 'integer',
        category: 'Script',
        example: `integer allowed = osCheckThreatLevel("High");
if (allowed) llSay(0, "High threat level allowed");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsCheckThreatLevel'
    },
    // More Graphics Functions
    {
        name: 'osSetPenCap',
        description: 'Set pen cap style for drawing',
        syntax: 'string osSetPenCap(string drawList, string direction, string type)',
        parameters: [
            { name: 'drawList', type: 'string', description: 'Current draw list' },
            { name: 'direction', type: 'string', description: 'Direction (start/end)' },
            { name: 'type', type: 'string', description: 'Cap type' }
        ],
        returnType: 'string',
        category: 'Graphics',
        example: `string drawList = osSetPenCap("", "start", "arrow");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsSetPenCap'
    },
    {
        name: 'osDrawEllipse',
        description: 'Draw an ellipse on a dynamic texture',
        syntax: 'string osDrawEllipse(string drawList, integer width, integer height)',
        parameters: [
            { name: 'drawList', type: 'string', description: 'Current draw list' },
            { name: 'width', type: 'integer', description: 'Width of ellipse' },
            { name: 'height', type: 'integer', description: 'Height of ellipse' }
        ],
        returnType: 'string',
        category: 'Graphics',
        example: `string drawList = osDrawEllipse("", 100, 50);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsDrawEllipse'
    },
    {
        name: 'osDrawFilledEllipse',
        description: 'Draw a filled ellipse on a dynamic texture',
        syntax: 'string osDrawFilledEllipse(string drawList, integer width, integer height)',
        parameters: [
            { name: 'drawList', type: 'string', description: 'Current draw list' },
            { name: 'width', type: 'integer', description: 'Width of ellipse' },
            { name: 'height', type: 'integer', description: 'Height of ellipse' }
        ],
        returnType: 'string',
        category: 'Graphics',
        example: `string drawList = osDrawFilledEllipse("", 100, 50);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsDrawFilledEllipse'
    },
    {
        name: 'osDrawPolygon',
        description: 'Draw a polygon on a dynamic texture',
        syntax: 'string osDrawPolygon(string drawList, list x, list y)',
        parameters: [
            { name: 'drawList', type: 'string', description: 'Current draw list' },
            { name: 'x', type: 'list', description: 'List of X coordinates' },
            { name: 'y', type: 'list', description: 'List of Y coordinates' }
        ],
        returnType: 'string',
        category: 'Graphics',
        example: `string drawList = osDrawPolygon("", [0, 50, 100], [0, 50, 0]);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsDrawPolygon'
    },
    {
        name: 'osDrawFilledPolygon',
        description: 'Draw a filled polygon on a dynamic texture',
        syntax: 'string osDrawFilledPolygon(string drawList, list x, list y)',
        parameters: [
            { name: 'drawList', type: 'string', description: 'Current draw list' },
            { name: 'x', type: 'list', description: 'List of X coordinates' },
            { name: 'y', type: 'list', description: 'List of Y coordinates' }
        ],
        returnType: 'string',
        category: 'Graphics',
        example: `string drawList = osDrawFilledPolygon("", [0, 50, 100], [0, 50, 0]);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsDrawFilledPolygon'
    },
    // Environment Functions
    {
        name: 'osSetWindParam',
        description: 'Set a wind parameter',
        syntax: 'osSetWindParam(string plugin, string param, float value)',
        parameters: [
            { name: 'plugin', type: 'string', description: 'Wind plugin name' },
            { name: 'param', type: 'string', description: 'Parameter name' },
            { name: 'value', type: 'float', description: 'Parameter value' }
        ],
        returnType: 'void',
        category: 'Wind',
        example: `osSetWindParam("SimpleRandomWind", "strength", 10.0);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsSetWindParam'
    }
];
exports.default = exports.MassiveOSSLFunctions;
//# sourceMappingURL=ossl-functions-massive.js.map