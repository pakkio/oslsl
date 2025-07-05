"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.additionalOSSLFunctions = void 0;
// Additional OSSL Functions - Expanding to cover the critical gaps
exports.additionalOSSLFunctions = [
    // Avatar/Agent Functions
    {
        name: 'osAgentSaveAppearance',
        description: 'Save an avatar appearance to a notecard',
        syntax: 'string osAgentSaveAppearance(key avatarId, string notecardName)',
        parameters: [
            { name: 'avatarId', type: 'key', description: 'UUID of the avatar' },
            { name: 'notecardName', type: 'string', description: 'Name of the notecard to save to' }
        ],
        returnType: 'string',
        category: 'Agent',
        example: `string result = osAgentSaveAppearance(llGetOwner(), "MyAppearance");
llSay(0, "Appearance saved: " + result);`,
        availability: 'OpenSimulator 0.7.4+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsAgentSaveAppearance'
    },
    {
        name: 'osAvatarName2Key',
        description: 'Get avatar key from first and last name',
        syntax: 'key osAvatarName2Key(string firstname, string lastname)',
        parameters: [
            { name: 'firstname', type: 'string', description: 'First name of the avatar' },
            { name: 'lastname', type: 'string', description: 'Last name of the avatar' }
        ],
        returnType: 'key',
        category: 'Agent',
        example: `key avatarId = osAvatarName2Key("John", "Doe");
if (avatarId != NULL_KEY) {
    llSay(0, "Found avatar: " + (string)avatarId);
}`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsAvatarName2Key'
    },
    {
        name: 'osKey2Name',
        description: 'Get avatar name from key',
        syntax: 'string osKey2Name(key avatarId)',
        parameters: [
            { name: 'avatarId', type: 'key', description: 'UUID of the avatar' }
        ],
        returnType: 'string',
        category: 'Agent',
        example: `string name = osKey2Name(llGetOwner());
llSay(0, "Owner name: " + name);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsKey2Name'
    },
    // Attachment Functions
    {
        name: 'osDropAttachment',
        description: 'Drop an attachment from an avatar',
        syntax: 'osDropAttachment()',
        parameters: [],
        returnType: 'void',
        category: 'Attachment',
        example: `osDropAttachment();
llSay(0, "Attachment dropped");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsDropAttachment'
    },
    {
        name: 'osDropAttachmentAt',
        description: 'Drop an attachment at a specific position',
        syntax: 'osDropAttachmentAt(vector pos, rotation rot)',
        parameters: [
            { name: 'pos', type: 'vector', description: 'Position to drop the attachment' },
            { name: 'rot', type: 'rotation', description: 'Rotation of the dropped attachment' }
        ],
        returnType: 'void',
        category: 'Attachment',
        example: `osDropAttachmentAt(llGetPos() + <0,0,1>, ZERO_ROTATION);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsDropAttachmentAt'
    },
    // Land/Parcel Functions  
    {
        name: 'osSetParcelDetails',
        description: 'Set details of a parcel',
        syntax: 'integer osSetParcelDetails(vector pos, list rules)',
        parameters: [
            { name: 'pos', type: 'vector', description: 'Position in the parcel' },
            { name: 'rules', type: 'list', description: 'List of rules to set' }
        ],
        returnType: 'integer',
        category: 'Parcel',
        example: `integer result = osSetParcelDetails(llGetPos(), [PARCEL_DETAILS_NAME, "New Parcel Name"]);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Severe',
        url: 'http://opensimulator.org/wiki/OsSetParcelDetails'
    },
    {
        name: 'osGetParcelID',
        description: 'Get the parcel ID for a position',
        syntax: 'key osGetParcelID(vector pos)',
        parameters: [
            { name: 'pos', type: 'vector', description: 'Position to query' }
        ],
        returnType: 'key',
        category: 'Parcel',
        example: `key parcelId = osGetParcelID(llGetPos());
llSay(0, "Parcel ID: " + (string)parcelId);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsGetParcelID'
    },
    // Database Functions
    {
        name: 'osSetPersistentSetting',
        description: 'Set a persistent setting in the database',
        syntax: 'osSetPersistentSetting(string namespace, string key, string value)',
        parameters: [
            { name: 'namespace', type: 'string', description: 'Namespace for the setting' },
            { name: 'key', type: 'string', description: 'Key for the setting' },
            { name: 'value', type: 'string', description: 'Value to store' }
        ],
        returnType: 'void',
        category: 'Database',
        example: `osSetPersistentSetting("MyApp", "counter", "42");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsSetPersistentSetting'
    },
    {
        name: 'osGetPersistentSetting',
        description: 'Get a persistent setting from the database',
        syntax: 'string osGetPersistentSetting(string namespace, string key)',
        parameters: [
            { name: 'namespace', type: 'string', description: 'Namespace for the setting' },
            { name: 'key', type: 'string', description: 'Key for the setting' }
        ],
        returnType: 'string',
        category: 'Database',
        example: `string value = osGetPersistentSetting("MyApp", "counter");
llSay(0, "Counter value: " + value);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetPersistentSetting'
    },
    // Texture/Graphics Functions
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
        example: `string drawList = osMovePen("", 100, 100);
drawList = osDrawText(drawList, "Hello at 100,100");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsMovePen'
    },
    {
        name: 'osDrawLine',
        description: 'Draw a line in the dynamic texture',
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
        name: 'osSetFontSize',
        description: 'Set the font size for text drawing',
        syntax: 'string osSetFontSize(string drawList, integer fontSize)',
        parameters: [
            { name: 'drawList', type: 'string', description: 'Current draw list' },
            { name: 'fontSize', type: 'integer', description: 'Font size in pixels' }
        ],
        returnType: 'string',
        category: 'Graphics',
        example: `string drawList = osSetFontSize("", 20);
drawList = osDrawText(drawList, "Large text");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsSetFontSize'
    },
    // Wind Functions
    {
        name: 'osSetWindParam',
        description: 'Set wind parameters',
        syntax: 'integer osSetWindParam(string plugin, string param, float value)',
        parameters: [
            { name: 'plugin', type: 'string', description: 'Wind plugin name' },
            { name: 'param', type: 'string', description: 'Parameter name' },
            { name: 'value', type: 'float', description: 'Parameter value' }
        ],
        returnType: 'integer',
        category: 'Wind',
        example: `integer result = osSetWindParam("ConfigurableWind", "strength", 5.0);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Severe',
        url: 'http://opensimulator.org/wiki/OsSetWindParam'
    },
    {
        name: 'osGetWindParam',
        description: 'Get wind parameters',
        syntax: 'float osGetWindParam(string plugin, string param)',
        parameters: [
            { name: 'plugin', type: 'string', description: 'Wind plugin name' },
            { name: 'param', type: 'string', description: 'Parameter name' }
        ],
        returnType: 'float',
        category: 'Wind',
        example: `float strength = osGetWindParam("ConfigurableWind", "strength");
llSay(0, "Wind strength: " + (string)strength);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Moderate',
        url: 'http://opensimulator.org/wiki/OsGetWindParam'
    },
    // Script/System Functions
    {
        name: 'osGetScriptEngineName',
        description: 'Get the name of the script engine',
        syntax: 'string osGetScriptEngineName()',
        parameters: [],
        returnType: 'string',
        category: 'System',
        example: `string engine = osGetScriptEngineName();
llSay(0, "Script engine: " + engine);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsGetScriptEngineName'
    },
    {
        name: 'osStringSubString',
        description: 'Extract a substring with UTF-8 support',
        syntax: 'string osStringSubString(string src, integer start, integer length)',
        parameters: [
            { name: 'src', type: 'string', description: 'Source string' },
            { name: 'start', type: 'integer', description: 'Start position' },
            { name: 'length', type: 'integer', description: 'Length of substring' }
        ],
        returnType: 'string',
        category: 'String',
        example: `string result = osStringSubString("Hello World", 6, 5);
llSay(0, "Substring: " + result); // "World"`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsStringSubString'
    },
    {
        name: 'osStringStartsWith',
        description: 'Check if a string starts with another string',
        syntax: 'integer osStringStartsWith(string src, string value, integer ignorecase)',
        parameters: [
            { name: 'src', type: 'string', description: 'Source string' },
            { name: 'value', type: 'string', description: 'String to check for' },
            { name: 'ignorecase', type: 'integer', description: 'Ignore case (1) or not (0)' }
        ],
        returnType: 'integer',
        category: 'String',
        example: `integer result = osStringStartsWith("Hello World", "Hello", 0);
if (result) llSay(0, "String starts with Hello");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsStringStartsWith'
    },
    {
        name: 'osStringEndsWith',
        description: 'Check if a string ends with another string',
        syntax: 'integer osStringEndsWith(string src, string value, integer ignorecase)',
        parameters: [
            { name: 'src', type: 'string', description: 'Source string' },
            { name: 'value', type: 'string', description: 'String to check for' },
            { name: 'ignorecase', type: 'integer', description: 'Ignore case (1) or not (0)' }
        ],
        returnType: 'integer',
        category: 'String',
        example: `integer result = osStringEndsWith("Hello World", "World", 0);
if (result) llSay(0, "String ends with World");`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsStringEndsWith'
    },
    // Region Management
    {
        name: 'osGetRegionMapTexture',
        description: 'Get the map texture UUID for the region',
        syntax: 'key osGetRegionMapTexture(string regionName)',
        parameters: [
            { name: 'regionName', type: 'string', description: 'Name of the region' }
        ],
        returnType: 'key',
        category: 'Region',
        example: `key mapTexture = osGetRegionMapTexture("Welcome Island");
llSay(0, "Map texture: " + (string)mapTexture);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsGetRegionMapTexture'
    },
    {
        name: 'osGetRegionSize',
        description: 'Get the size of the current region',
        syntax: 'vector osGetRegionSize()',
        parameters: [],
        returnType: 'vector',
        category: 'Region',
        example: `vector size = osGetRegionSize();
llSay(0, "Region size: " + (string)size);`,
        availability: 'OpenSimulator 0.7.6+',
        permissions: 'OSSL_Public',
        url: 'http://opensimulator.org/wiki/OsGetRegionSize'
    },
    // Sound Functions
    {
        name: 'osPlaySound',
        description: 'Play a sound with extended parameters',
        syntax: 'osPlaySound(integer linknum, string sound, float volume)',
        parameters: [
            { name: 'linknum', type: 'integer', description: 'Link number' },
            { name: 'sound', type: 'string', description: 'Sound UUID or name' },
            { name: 'volume', type: 'float', description: 'Volume (0.0 to 1.0)' }
        ],
        returnType: 'void',
        category: 'Sound',
        example: `osPlaySound(LINK_THIS, "sound_uuid", 0.5);`,
        availability: 'OpenSimulator 0.7.0+',
        permissions: 'OSSL_High',
        url: 'http://opensimulator.org/wiki/OsPlaySound'
    }
];
//# sourceMappingURL=additional-ossl-functions.js.map