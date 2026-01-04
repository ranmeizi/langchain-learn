import { InitializePageTool } from "./browser_actions/InitializePageTool";
import { OpenPageTool } from "./browser_actions/OpenPageTool";
import { RefreshTool } from "./browser_actions/RefreshTool";
import { ScrollForResponseTool } from "./browser_actions/ScrollForResponseTool";
import { ScrollTool } from "./browser_actions/ScrollTool";
import { WaitForNetworkIdleTool } from "./browser_actions/WaitForNetworkIdleTool";
import { WaitForResponseTool } from "./browser_actions/WaitForResponseTool";
import { GetSimpleNodeWithSearchKeyWordTool } from "./browser_verify/GetSimpleNodeWithSearchKeyWord";
import { VerifyElementCanScrollTool } from "./browser_verify/VerifyElementCanScrollTool";
import { VerifyElementExistTool } from "./browser_verify/VerifyElementExistTool";
import { WriteResCodeTool } from "./fs_action/write_res_code";

const tools = [
    InitializePageTool,
    OpenPageTool,
    RefreshTool,
    // ScrollTool,
    ScrollForResponseTool,
    WaitForNetworkIdleTool,
    // WaitForResponseTool,
    GetSimpleNodeWithSearchKeyWordTool,
    VerifyElementExistTool,
    VerifyElementCanScrollTool,
    WriteResCodeTool
]

export { tools }