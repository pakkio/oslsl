"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSSLFunctions = void 0;
const ossl_functions_extended_js_1 = require("./ossl-functions-extended.js");
class OSSLFunctions {
    static getAllFunctions() {
        const coreFunctions = [
            // NPC Functions
            {
                name: 'osIsNpc',
                description: 'Returns TRUE if the given key is an NPC, FALSE otherwise',
                syntax: 'integer osIsNpc(key npc)',
                parameters: [
                    { name: 'npc', type: 'key', description: 'The key to check if it is an NPC' }
                ],
                returnType: 'integer',
                category: 'NPC',
                example: `integer result = osIsNpc(llDetectedKey(0));
if (result) {
    llSay(0, "This is an NPC");
} else {
    llSay(0, "This is not an NPC");
}`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Public',
                url: 'http://opensimulator.org/wiki/OsIsNpc'
            },
            {
                name: 'osNpcSay',
                description: 'Gets the NPC to say the given message',
                syntax: 'osNpcSay(key npc, string message)',
                parameters: [
                    { name: 'npc', type: 'key', description: 'The NPC UUID' },
                    { name: 'message', type: 'string', description: 'The message to say' }
                ],
                returnType: 'void',
                category: 'NPC',
                example: `key npc = osNpcCreate("John", "Doe", llGetPos(), "");
osNpcSay(npc, "Hello, I am an NPC!");`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_NPC',
                url: 'http://opensimulator.org/wiki/OsNpcSay'
            },
            {
                name: 'osNpcSay',
                description: 'Gets the NPC to say the given message on the specified channel',
                syntax: 'osNpcSay(key npc, integer channel, string message)',
                parameters: [
                    { name: 'npc', type: 'key', description: 'The NPC UUID' },
                    { name: 'channel', type: 'integer', description: 'The channel to speak on' },
                    { name: 'message', type: 'string', description: 'The message to say' }
                ],
                returnType: 'void',
                category: 'NPC',
                example: `key npc = osNpcCreate("John", "Doe", llGetPos(), "");
osNpcSay(npc, 1, "Hello on channel 1!");`,
                availability: 'OpenSimulator 0.7.4+',
                permissions: 'OSSL_NPC',
                url: 'http://opensimulator.org/wiki/OsNpcSay_(with_channel)'
            },
            {
                name: 'osNpcCreate',
                description: 'Create an NPC (Non-Player Character)',
                syntax: 'key osNpcCreate(string firstname, string lastname, vector position, string notecard)',
                parameters: [
                    { name: 'firstname', type: 'string', description: 'First name of the NPC' },
                    { name: 'lastname', type: 'string', description: 'Last name of the NPC' },
                    { name: 'position', type: 'vector', description: 'Position to create the NPC' },
                    { name: 'notecard', type: 'string', description: 'Notecard containing appearance data' }
                ],
                returnType: 'key',
                category: 'NPC',
                example: `key npc = osNpcCreate("John", "Doe", llGetPos() + <1,0,0>, "");
if (npc != NULL_KEY) {
    llSay(0, "NPC created successfully");
}`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_NPC',
                url: 'http://opensimulator.org/wiki/OsNpcCreate'
            },
            {
                name: 'osNpcRemove',
                description: 'Remove an NPC from the scene',
                syntax: 'osNpcRemove(key npc)',
                parameters: [
                    { name: 'npc', type: 'key', description: 'The NPC UUID to remove' }
                ],
                returnType: 'void',
                category: 'NPC',
                example: `osNpcRemove(npc);
llSay(0, "NPC removed");`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_NPC',
                url: 'http://opensimulator.org/wiki/OsNpcRemove'
            },
            {
                name: 'osNpcMoveTo',
                description: 'Make an NPC move to a specified position',
                syntax: 'osNpcMoveTo(key npc, vector position)',
                parameters: [
                    { name: 'npc', type: 'key', description: 'The NPC UUID' },
                    { name: 'position', type: 'vector', description: 'Target position' }
                ],
                returnType: 'void',
                category: 'NPC',
                example: `osNpcMoveTo(npc, llGetPos() + <5,0,0>);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_NPC',
                url: 'http://opensimulator.org/wiki/OsNpcMoveTo'
            },
            // Agent Functions
            {
                name: 'osTeleportAgent',
                description: 'Teleport an agent to another position and region',
                syntax: 'osTeleportAgent(key agent, string regionName, vector position, vector lookAt)',
                parameters: [
                    { name: 'agent', type: 'key', description: 'The agent UUID to teleport' },
                    { name: 'regionName', type: 'string', description: 'Name of the destination region' },
                    { name: 'position', type: 'vector', description: 'Position in the destination region' },
                    { name: 'lookAt', type: 'vector', description: 'Direction to look at' }
                ],
                returnType: 'void',
                category: 'Agent',
                example: `osTeleportAgent(llGetOwner(), "Welcome Island", <128,128,25>, <1,0,0>);`,
                availability: 'OpenSimulator 0.6.9+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsTeleportAgent'
            },
            {
                name: 'osSetSpeed',
                description: 'Set the speed of an avatar',
                syntax: 'osSetSpeed(key avatar, float speed)',
                parameters: [
                    { name: 'avatar', type: 'key', description: 'The avatar UUID' },
                    { name: 'speed', type: 'float', description: 'The new speed multiplier' }
                ],
                returnType: 'void',
                category: 'Agent',
                example: `osSetSpeed(llGetOwner(), 2.0); // Double speed`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsSetSpeed'
            },
            {
                name: 'osForceAttachToAvatar',
                description: 'Force an object to attach to an avatar',
                syntax: 'osForceAttachToAvatar(integer attachPoint)',
                parameters: [
                    { name: 'attachPoint', type: 'integer', description: 'The attachment point' }
                ],
                returnType: 'void',
                category: 'Agent',
                example: `osForceAttachToAvatar(ATTACH_CHEST);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsForceAttachToAvatar'
            },
            // Region Functions
            {
                name: 'osGetRegionStats',
                description: 'Get statistics about the current region',
                syntax: 'list osGetRegionStats()',
                parameters: [],
                returnType: 'list',
                category: 'Region',
                example: `list stats = osGetRegionStats();
float timeDilation = llList2Float(stats, 0);
float simFPS = llList2Float(stats, 1);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsGetRegionStats'
            },
            {
                name: 'osGetSimulatorVersion',
                description: 'Get the version of the OpenSimulator instance',
                syntax: 'string osGetSimulatorVersion()',
                parameters: [],
                returnType: 'string',
                category: 'Region',
                example: `string version = osGetSimulatorVersion();
llSay(0, "Running OpenSimulator " + version);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsGetSimulatorVersion'
            },
            {
                name: 'osConsoleCommand',
                description: 'Execute a console command on the server',
                syntax: 'osConsoleCommand(string command)',
                parameters: [
                    { name: 'command', type: 'string', description: 'The console command to execute' }
                ],
                returnType: 'void',
                category: 'Console',
                example: `osConsoleCommand("alert This is a test alert");`,
                availability: 'OpenSimulator 0.6.9+',
                permissions: 'OSSL_Severe',
                url: 'http://opensimulator.org/wiki/OsConsoleCommand'
            },
            // Graphics Functions
            {
                name: 'osDrawText',
                description: 'Draw text on a dynamic texture',
                syntax: 'string osDrawText(string drawList, string text)',
                parameters: [
                    { name: 'drawList', type: 'string', description: 'The draw list to append to' },
                    { name: 'text', type: 'string', description: 'The text to draw' }
                ],
                returnType: 'string',
                category: 'Graphics',
                example: `string drawList = osDrawText("", "Hello World");
llSetText("", <1,1,1>, 1.0);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Public',
                url: 'http://opensimulator.org/wiki/OsDrawText'
            },
            {
                name: 'osSetDynamicTextureData',
                description: 'Set dynamic texture data on a prim face',
                syntax: 'string osSetDynamicTextureData(string dynamicID, string contentType, string data, string extraParams, integer timer)',
                parameters: [
                    { name: 'dynamicID', type: 'string', description: 'Dynamic texture ID' },
                    { name: 'contentType', type: 'string', description: 'Content type (e.g., "vector")' },
                    { name: 'data', type: 'string', description: 'The texture data' },
                    { name: 'extraParams', type: 'string', description: 'Extra parameters' },
                    { name: 'timer', type: 'integer', description: 'Timer in milliseconds' }
                ],
                returnType: 'string',
                category: 'Graphics',
                example: `string drawList = osDrawText("", "Dynamic Text");
osSetDynamicTextureData("", "vector", drawList, "", 0);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Public',
                url: 'http://opensimulator.org/wiki/OsSetDynamicTextureData'
            },
            // Parcel Functions
            {
                name: 'osGetParcelDetails',
                description: 'Get details about a parcel',
                syntax: 'list osGetParcelDetails(vector pos, list params)',
                parameters: [
                    { name: 'pos', type: 'vector', description: 'Position in the parcel' },
                    { name: 'params', type: 'list', description: 'List of parameters to query' }
                ],
                returnType: 'list',
                category: 'Parcel',
                example: `list details = osGetParcelDetails(llGetPos(), [PARCEL_DETAILS_NAME]);
string parcelName = llList2String(details, 0);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Public',
                url: 'http://opensimulator.org/wiki/OsGetParcelDetails'
            },
            // Media Functions
            {
                name: 'osSetParcelMediaURL',
                description: 'Set the media URL for a parcel',
                syntax: 'osSetParcelMediaURL(string url)',
                parameters: [
                    { name: 'url', type: 'string', description: 'The media URL to set' }
                ],
                returnType: 'void',
                category: 'Media',
                example: `osSetParcelMediaURL("http://example.com/media.mp4");`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsSetParcelMediaURL'
            },
            // Wind Functions
            {
                name: 'osWindActiveModelPluginName',
                description: 'Get the name of the active wind model plugin',
                syntax: 'string osWindActiveModelPluginName()',
                parameters: [],
                returnType: 'string',
                category: 'Wind',
                example: `string windModel = osWindActiveModelPluginName();
llSay(0, "Wind model: " + windModel);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Public',
                url: 'http://opensimulator.org/wiki/OsWindActiveModelPluginName'
            },
            // Inventory Functions
            {
                name: 'osGetInventoryDesc',
                description: 'Get the description of an inventory item',
                syntax: 'string osGetInventoryDesc(string item)',
                parameters: [
                    { name: 'item', type: 'string', description: 'The inventory item name' }
                ],
                returnType: 'string',
                category: 'Inventory',
                example: `string desc = osGetInventoryDesc("MyTexture");
llSay(0, "Description: " + desc);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Public',
                url: 'http://opensimulator.org/wiki/OsGetInventoryDesc'
            },
            // HTTP Functions
            {
                name: 'osRequestURL',
                description: 'Request a URL for HTTP-in',
                syntax: 'key osRequestURL()',
                parameters: [],
                returnType: 'key',
                category: 'HTTP',
                example: `key requestId = osRequestURL();
// Handle in http_request event`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsRequestURL'
            },
            // Chat Functions
            {
                name: 'osNpcSayTo',
                description: 'Gets the NPC to say the given message to a specific target',
                syntax: 'osNpcSayTo(key npc, key target, integer channel, string message)',
                parameters: [
                    { name: 'npc', type: 'key', description: 'The NPC UUID' },
                    { name: 'target', type: 'key', description: 'The target agent UUID' },
                    { name: 'channel', type: 'integer', description: 'The channel to speak on' },
                    { name: 'message', type: 'string', description: 'The message to say' }
                ],
                returnType: 'void',
                category: 'NPC',
                example: `osNpcSayTo(npc, llGetOwner(), 0, "Hello owner!");`,
                availability: 'OpenSimulator 0.7.4+',
                permissions: 'OSSL_NPC',
                url: 'http://opensimulator.org/wiki/OsNpcSayTo'
            },
            // Threat Level Functions
            {
                name: 'osCheckODE',
                description: 'Check if ODE physics is enabled',
                syntax: 'integer osCheckODE()',
                parameters: [],
                returnType: 'integer',
                category: 'Physics',
                example: `if (osCheckODE()) {
    llSay(0, "ODE physics enabled");
}`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Public',
                url: 'http://opensimulator.org/wiki/OsCheckODE'
            },
            // Critical Missing Functions
            {
                name: 'osSetDynamicTextureURL',
                description: 'Set texture on a prim face using a URL to an image',
                syntax: 'string osSetDynamicTextureURL(string dynamicID, string contentType, string url, string extraParams, integer timer)',
                parameters: [
                    { name: 'dynamicID', type: 'string', description: 'Dynamic texture ID' },
                    { name: 'contentType', type: 'string', description: 'Content type (usually "")' },
                    { name: 'url', type: 'string', description: 'URL to the image' },
                    { name: 'extraParams', type: 'string', description: 'Additional parameters' },
                    { name: 'timer', type: 'integer', description: 'Timer in milliseconds' }
                ],
                returnType: 'string',
                category: 'Graphics',
                example: `osSetDynamicTextureURL("", "", "http://example.com/image.jpg", "", 0);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsSetDynamicTextureURL'
            },
            {
                name: 'osGetAvatarList',
                description: 'Get a list of all avatars in the region',
                syntax: 'list osGetAvatarList()',
                parameters: [],
                returnType: 'list',
                category: 'Region',
                example: `list avatars = osGetAvatarList();
integer i;
for (i = 0; i < llGetListLength(avatars); i += 3) {
    key avatar = llList2Key(avatars, i);
    string name = llList2String(avatars, i + 1);
    vector pos = llList2Vector(avatars, i + 2);
    llSay(0, "Avatar: " + name + " at " + (string)pos);
}`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsGetAvatarList'
            },
            {
                name: 'osParseJSON',
                description: 'Parse a JSON string and return the corresponding LSL data',
                syntax: 'string osParseJSON(string json)',
                parameters: [
                    { name: 'json', type: 'string', description: 'JSON string to parse' }
                ],
                returnType: 'string',
                category: 'Data',
                example: `string json = "{\"name\":\"John\",\"age\":30}";
string result = osParseJSON(json);
llSay(0, "Parsed: " + result);`,
                availability: 'OpenSimulator 0.8.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsParseJSON'
            },
            {
                name: 'osMessageObject',
                description: 'Send a message to an object',
                syntax: 'osMessageObject(key objectID, string message)',
                parameters: [
                    { name: 'objectID', type: 'key', description: 'UUID of the target object' },
                    { name: 'message', type: 'string', description: 'Message to send' }
                ],
                returnType: 'void',
                category: 'Communication',
                example: `key targetObject = "550e8400-e29b-41d4-a716-446655440000";
osMessageObject(targetObject, "Hello from another object!");`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsMessageObject'
            },
            {
                name: 'osGetNotecard',
                description: 'Read the contents of a notecard',
                syntax: 'string osGetNotecard(string name)',
                parameters: [
                    { name: 'name', type: 'string', description: 'Name of the notecard' }
                ],
                returnType: 'string',
                category: 'Inventory',
                example: `string content = osGetNotecard("config");
if (content != "") {
    llSay(0, "Notecard content: " + content);
} else {
    llSay(0, "Notecard not found or empty");
}`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsGetNotecard'
            },
            {
                name: 'osGetSimulatorMemory',
                description: 'Get memory usage statistics of the simulator',
                syntax: 'integer osGetSimulatorMemory()',
                parameters: [],
                returnType: 'integer',
                category: 'Region',
                example: `integer memory = osGetSimulatorMemory();
llSay(0, "Simulator memory: " + (string)memory + " MB");`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsGetSimulatorMemory'
            },
            {
                name: 'osGetGridName',
                description: 'Get the name of the grid',
                syntax: 'string osGetGridName()',
                parameters: [],
                returnType: 'string',
                category: 'Grid',
                example: `string gridName = osGetGridName();
llSay(0, "Grid name: " + gridName);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsGetGridName'
            },
            {
                name: 'osGetGridLoginURI',
                description: 'Get the login URI of the grid',
                syntax: 'string osGetGridLoginURI()',
                parameters: [],
                returnType: 'string',
                category: 'Grid',
                example: `string loginURI = osGetGridLoginURI();
llSay(0, "Grid login URI: " + loginURI);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsGetGridLoginURI'
            },
            {
                name: 'osGetGridGatekeeperURI',
                description: 'Get the gatekeeper URI of the grid',
                syntax: 'string osGetGridGatekeeperURI()',
                parameters: [],
                returnType: 'string',
                category: 'Grid',
                example: `string gatekeeperURI = osGetGridGatekeeperURI();
llSay(0, "Gatekeeper URI: " + gatekeeperURI);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsGetGridGatekeeperURI'
            },
            {
                name: 'osListenRegex',
                description: 'Set up a listener that filters chat using regular expressions',
                syntax: 'integer osListenRegex(integer channel, string name, key id, string msg, integer regexBitfield)',
                parameters: [
                    { name: 'channel', type: 'integer', description: 'Channel to listen on' },
                    { name: 'name', type: 'string', description: 'Name to filter by' },
                    { name: 'id', type: 'key', description: 'ID to filter by' },
                    { name: 'msg', type: 'string', description: 'Regular expression pattern' },
                    { name: 'regexBitfield', type: 'integer', description: 'Regex options bitfield' }
                ],
                returnType: 'integer',
                category: 'Communication',
                example: `integer handle = osListenRegex(0, "", NULL_KEY, "^hello.*", 0);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsListenRegex'
            },
            {
                name: 'osRegexIsMatch',
                description: 'Test if a string matches a regular expression',
                syntax: 'integer osRegexIsMatch(string input, string pattern)',
                parameters: [
                    { name: 'input', type: 'string', description: 'Input string to test' },
                    { name: 'pattern', type: 'string', description: 'Regular expression pattern' }
                ],
                returnType: 'integer',
                category: 'String',
                example: `integer match = osRegexIsMatch("hello world", "^hello");
if (match) llSay(0, "Pattern matched!");`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsRegexIsMatch'
            },
            {
                name: 'osGetPhysicsEngineType',
                description: 'Get the type of physics engine being used',
                syntax: 'string osGetPhysicsEngineType()',
                parameters: [],
                returnType: 'string',
                category: 'Physics',
                example: `string engine = osGetPhysicsEngineType();
llSay(0, "Physics engine: " + engine);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_Moderate',
                url: 'http://opensimulator.org/wiki/OsGetPhysicsEngineType'
            },
            {
                name: 'osGetPrimitiveParams',
                description: 'Get primitive parameters for any object in the region',
                syntax: 'list osGetPrimitiveParams(key prim, list rules)',
                parameters: [
                    { name: 'prim', type: 'key', description: 'UUID of the primitive' },
                    { name: 'rules', type: 'list', description: 'List of parameters to get' }
                ],
                returnType: 'list',
                category: 'Object',
                example: `list params = osGetPrimitiveParams(llGetKey(), [PRIM_POSITION, PRIM_SIZE]);
vector pos = llList2Vector(params, 0);
vector size = llList2Vector(params, 1);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsGetPrimitiveParams'
            },
            {
                name: 'osSetPrimitiveParams',
                description: 'Set primitive parameters for any object in the region',
                syntax: 'osSetPrimitiveParams(key prim, list rules)',
                parameters: [
                    { name: 'prim', type: 'key', description: 'UUID of the primitive' },
                    { name: 'rules', type: 'list', description: 'List of parameters to set' }
                ],
                returnType: 'void',
                category: 'Object',
                example: `osSetPrimitiveParams(llGetKey(), [PRIM_COLOR, ALL_SIDES, <1,0,0>, 1.0]);`,
                availability: 'OpenSimulator 0.7.0+',
                permissions: 'OSSL_High',
                url: 'http://opensimulator.org/wiki/OsSetPrimitiveParams'
            }
        ];
        // Merge core functions with extended functions for comprehensive coverage
        return [...coreFunctions, ...ossl_functions_extended_js_1.ExtendedOSSLFunctions];
    }
    static getPermissionLevels() {
        return {
            'OSSL_Public': {
                level: 'Public',
                description: 'Functions available to all scripts',
                threat: 'None'
            },
            'OSSL_Moderate': {
                level: 'Moderate',
                description: 'Functions with moderate security implications',
                threat: 'Low'
            },
            'OSSL_High': {
                level: 'High',
                description: 'Functions with high security implications',
                threat: 'Medium'
            },
            'OSSL_Severe': {
                level: 'Severe',
                description: 'Functions with severe security implications',
                threat: 'High'
            },
            'OSSL_NPC': {
                level: 'NPC',
                description: 'Functions for NPC management',
                threat: 'Low-Medium'
            }
        };
    }
    static getCategories() {
        return [
            'NPC', 'Agent', 'Region', 'Console', 'Graphics',
            'Parcel', 'Media', 'Wind', 'Inventory', 'HTTP', 'Physics',
            'Data', 'Communication', 'Grid', 'String', 'Object',
            'Time', 'Sound', 'Animation', 'Script'
        ];
    }
    static getFunctionByName(name) {
        const functions = this.getAllFunctions();
        return functions.find(func => func.name === name);
    }
    static getFunctionsByCategory(category) {
        const functions = this.getAllFunctions();
        return functions.filter(func => func.category === category);
    }
}
exports.OSSLFunctions = OSSLFunctions;
//# sourceMappingURL=ossl-functions.js.map