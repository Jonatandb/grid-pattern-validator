import clc from "cli-color";
const cy = clc.yellow

export const SLEEP_SECONDS = 1
export const EXPLOSION = "💥"
// export const GEMS: string[] = ["🟣","⚪","🔴","🔵","🟡","🟢","🟤"]
export const GEMS: string[] = ["🟣","⚪","🔴"]
// export const GEMS_TO_FILL: string[] = ["🟪", "⬜", "🟥", "🟦", "🟨", "🟩", "🟫"]
export const GEMS_TO_FILL: string[] = ["🟪", "🔲", "🟥"]
export const PATTERNS = [
    [
        [1,0,1,1],
    ],[
        [1,1,0],
        [0,0,1],
    ],[
        [1,0,1],
        [0,1,0],
    ],[
        [0,1,1],
        [1,0,0],
]]


// SPECIAL GEMS
const RAY_H = "☡ "
const RAY_V = "ϟ "
const BOMB = "💣"

export const SPECIAL_GEMS_RAY_H = [cy.bgMagenta(RAY_H), cy.bgWhite(RAY_H), cy.bgRed(RAY_H), cy.bgBlue(RAY_H), cy.bgYellowBright(RAY_H), cy.bgGreen(RAY_H), cy.bgBlackBright(RAY_H)]
export const SPECIAL_GEMS_RAY_V = [cy.bgMagenta(RAY_V), cy.bgWhite(RAY_V), cy.bgRed(RAY_V), cy.bgBlue(RAY_V), cy.bgYellowBright(RAY_V), cy.bgGreen(RAY_V), cy.bgBlackBright(RAY_V)]
export const SPECIAL_GEMS_BOMB = [cy.bgMagenta(BOMB), cy.bgWhite(BOMB), cy.bgRed(BOMB), cy.bgBlue(BOMB), cy.bgYellowBright(BOMB), cy.bgGreen(BOMB), cy.bgBlackBright(BOMB)]
export const SPECIAL_GEM_RAINBOW = "🌈"

export const PATTERNS_RAY = [[1,1,1,1]]

export const PATTERNS_BOMB = [
    [
        [1,1,1],
        [0,0,1],
        [0,0,1],
    ],[
        [1,1,1],
        [0,1,0],
        [0,1,0],
]]

export const PATTERNS_RAINBOW = [[1,1,1,1,1]]