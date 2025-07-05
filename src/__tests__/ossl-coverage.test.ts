
import { OSSLFunctions } from '../data/ossl-functions';

describe('OSSL Function Coverage', () => {
  it('should have a comprehensive list of OSSL functions', () => {
    const allFunctions = OSSLFunctions.getAllFunctions();
    const functionNames = allFunctions.map(f => f.name);

    // This is a list of known OSSL functions.
    // It should be updated as new functions are added to OpenSimulator.
    const knownOSSLFunctions = [
        "osSetWindParam",
        "osGetWindParam",
        "osWindActiveModelPluginName",
        "osSetParcelMediaURL",
        "osGetParcelDetails",
        "osSetDynamicTextureURL",
        "osSetDynamicTextureURLBlend",
        "osSetDynamicTextureData",
        "osDrawText",
        "osDrawLine",
        "osDrawFilledRectangle",
        "osSetFontSize",
        "osSetPenColor",
        "osMovePen",
        "osGetGridName",
        "osGetGridLoginURI",
        "osGetGridGatekeeperURI",
        "osGetSimulatorVersion",
        "osGetRegionStats",
        "osGetRegionSize",
        "osGetRegionMapTexture",
        "osGetSimulatorMemory",
        "osGetAvatarList",
        "osTeleportAgent",
        "osKickAvatar",
        "osForceOtherSit",
        "osSetSpeed",
        "osForceAttachToAvatar",
        "osGetNumberOfAttachments",
        "osAgentSaveAppearance",
        "osAvatarName2Key",
        "osKey2Name",
        "osIsNpc",
        "osNpcCreate",
        "osNpcRemove",
        "osNpcMoveTo",
        "osNpcSay",
        "osNpcSayTo",
        "osNpcSetRot",
        "osNpcSit",
        "osNpcStand",
        "osNpcLoadAppearance",
        "osNpcSaveAppearance",
        "osGetInventoryName",
        "osGetInventoryDesc",
        "osGetNotecard",
        "osMessageObject",
        "osListenRegex",
        "osRegexIsMatch",
        "osParseJSON",
        "osGetPhysicsEngineType",
        "osCheckODE",
        "osGetPrimitiveParams",
        "osSetPrimitiveParams",
        "osGetScriptEngineName",
        "osResetAllScripts",
        "osGetUnixTime",
        "osFormatString",
        "osMatchString",
        "osReplaceString",
        "osStringSubString",
        "osStringStartsWith",
        "osStringEndsWith",
        "osPlaySound",
        "osAvatarPlayAnimation",
        "osAvatarStopAnimation",
        "osSetProjectionParams",
        "osGetParcelOwner",
        "osSetParcelDetails",
        "osDropAttachment",
        "osDropAttachmentAt",
        "osGetParcelID",
        "osSetPersistentSetting",
        "osGetPersistentSetting",
        "osShutDown",
        "osConsoleCommand",
        "osRequestURL",
        "osGetAvatarHomeURI"
    ];

    const missingFunctions = knownOSSLFunctions.filter(f => !functionNames.includes(f));
    
    expect(missingFunctions).toEqual([]);
  });
});
