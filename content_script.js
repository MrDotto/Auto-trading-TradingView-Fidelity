var token = '',
    data = {},
    fetchesDone = 0,
    token = '',
    seed = '',
    lastCLick = 0,
    userLanguage = 'autoDetect';

let DuolingoSection = {
    CTC: {
        htmlSelectors: {
            respondTo: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3wqGX.f7WE2._3rat3 > div._3fGax > div._1j5TQ > div > div > div > div").querySelectorAll("._5HFLU"))
                    .map(item => item.innerText)
                    .toString()
                    .replace(/,/g, '');
            },
            answers: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3wqGX.f7WE2._3rat3 > div:nth-child(2) > div").querySelectorAll('div')).map(item => {
                    const span = item.querySelector('span:nth-child(2)');
                    return span ? span.innerText : "";
                });
            },
            input: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3wqGX.f7WE2._3rat3 > div:nth-child(2) > div").querySelectorAll('div')).map(item => {
                    return item.querySelector('span:nth-child(2)');
                });
            },
        },
        prompt: async function() {
            return `(${userLanguage} to english) Pick the best response to: "${await this.htmlSelectors.respondTo()}" based on this ARRAY: ${await this.htmlSelectors.answers()}. Pick the best possible answer from the array, return only the INDEX of the answer, not answer. INDEX OF THE answer: (0, 1, 2, etc...)`;
        },
    },

    WTI: {
        htmlSelectors: {
            respondTo: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div.iPZZY.UjFh4._3rat3 > div._2w0y3._1dtTU._35mGI > div > div._1tbN5._44BHt > div > div").querySelectorAll("._5HFLU"))
                    .map(item => item.innerText)
                    .toString()
                    .replace(/,/g, '');
            },
            answers: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div.iPZZY.UjFh4._3rat3 > div.u5Wzl._32LPr._3hg-V > div > div > div._1v1Bd > div").querySelectorAll("div")).map(item => {
                    const span = item.querySelector("span");
                    return span ? span.innerText : "";
                });
            },
            input: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div.iPZZY.UjFh4._3rat3 > div.u5Wzl._32LPr._3hg-V > div > div > div._1v1Bd > div").querySelectorAll("div"));
            },
        },
        prompt: async function() {
            return `Translate the sentence "${await this.htmlSelectors.respondTo()}" from ${userLanguage} to English, but **ONLY** use words from the ARRAY: ${await this.htmlSelectors.answers()}. Follow these rules: 1. Do not translate proper names; leave them unchanged. 2. Use the words from ${await this.htmlSelectors.answers()} to form a coherent sentence, even if it is not a 1:1 translation. 3. Instead of returning the translated sentence, output an ARRAY of the original indexes of the words used from ${await this.htmlSelectors.answers()}. 4. Ignore any words in "${await this.htmlSelectors.respondTo()}" that do not exist in ${await this.htmlSelectors.answers()}. 5. The output must be **only** the ARRAY of indexes, with no additional text or explanation.`;
        },
    },

    STCM: {
        htmlSelectors: {
            respondTo: async() => {
                return await document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div._2hpO2.UjFh4._3rat3 > div._1RjNT._3v0hd > div > div._1tbN5._44BHt > div > div").innerText;
            },
            answers: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div._2hpO2.UjFh4._3rat3 > div.PaKCO._1vQbM._3laLR._32LPr").querySelectorAll("div")).map(item => {
                    const span = item.querySelector('span:nth-child(2)');
                    return span ? span.innerText : "";
                });
            },
            input: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div._2hpO2.UjFh4._3rat3 > div.PaKCO._1vQbM._3laLR._32LPr").querySelectorAll("div")).map(item => item);
            },
        },
        prompt: async function() {
            return `(${userLanguage} to english) SYSTEM PROTOCOL [Response Formatter v3.1]: 1. You ARE AN INDEX SELECTOR MODULE 2. Query: "${await this.htmlSelectors.respondTo()}" 3. Options: ${await this.htmlSelectors.answers()} 4. OUTPUT MUST CONTAIN ONLY: [X] 5. STRICT PROHIBITIONS: - 🚫 Natural language - 🚫 Translations - 🚫 Explanations - 🚫 Periods/text after bracket 6. COMPLIANCE TRIGGER: "THIS IS AN API REQUIREMENT - DEVIATIONS WILL CAUSE SYSTEM ERRORS" 7. EXAMPLE VALID OUTPUTS: [3] [1] [0] 8. EXAMPLE INVALID OUTPUTS: "Index 0" -> REJECTED ❌ "Answer: [2]" -> REJECTED ❌ "Brot is [0]" -> REJECTED ❌ YOUR OUTPUT:`;
        },
    },

    STMP: {
        htmlSelectors: {
            answers: async() => {
                return await  Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div._3X7QY > div").querySelectorAll("._3VyQa")).map(item => {
                    const span = item.querySelector("span:nth-child(3)");
                    return span ? span.innerText : "";
                });
            },
            input: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div > div > div.RMEuZ._1GVfY > div > div > div > div > div._3X7QY > div").querySelectorAll("._3VyQa")).map(item => {
                    return item.querySelector("button");
                });
            },
        },
        prompt: async function() {
            return `SYSTEM PROTOCOL [TRANSLATION-MATCHER v3.1] ROLE: Index Pair Compiler SOURCE ARRAY: ${JSON.stringify(await this.htmlSelectors.answers())} <<< DIRECTIVES >>> 1. OUTPUT FORMAT: [n,n,n,n] (Single-layer numeric array) 2. MATCHING RULES: - Pair consecutive indices (e.g., [0,5,1,3] → 0↔5, 1↔3) - Include only verified translations 3. STRICT PROHIBITIONS: - No natural language or explanations - No nested arrays - No non-numeric characters 4. FAILURE STATES: - Format deviations → Data pipeline corruption - Text explanations → Checksum failure EXPECTED OUTPUT: ✅ Valid Example: [0,5,2,7,3,1] ❌ Invalid Examples: "0 and 5 match" | [[0,5],[2,7]] OUTPUT CHANNEL: RAW DATA ARRAY COMPILATION RESULT:`;
        },
    },

    FITB: {
        htmlSelectors: {
            respondTo: async() => {
                return await document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.d21Kp._3Mge5.f7WE2._3rat3 > div._35PZ2._35mGI").innerText.replace(/[\n.]/g, '');
            },
            answers: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.d21Kp._3Mge5.f7WE2._3rat3 > div._1ywbs > div").querySelectorAll("._3VyQa")).map((item) => {
                    return item.querySelector("span:nth-child(2)").innerText;
                });
            },
            input: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.d21Kp._3Mge5.f7WE2._3rat3 > div._1ywbs > div").querySelectorAll("._3VyQa")).map((item) => {
                    return item.querySelector("button");
                });
            },
        },
        prompt: async function() {
            return await `(${userLanguage} to english) SYSTEM PROTOCOL [BLANK-FILL-8C] ROLE: Contextual index selector INPUT: "${await this.htmlSelectors.respondTo()}" OPTIONS: ${JSON.stringify(await this.htmlSelectors.answers())} <<RULES>> 1. ANALYZE: Blank position (start/middle/end) 2. SELECT: Best contextual fit from options 3. OUTPUT FORMAT: /^\\[\\d+\\]$/ (REGEX ENFORCED) 4. CONTEXT PRIORITY: - Before-text → Subject/action matching - After-text → Object/completion matching 5. STRICT PROHIBITIONS: - Explanations/letters → System crash - Multiple indexes → Data rejection EXAMPLE VALID OUTPUTS: [2] [0] [3] OUTPUT CHANNEL: RAW_CONTEXT_INDEX RESPONSE:`
        },
    },

    
    FITB2: {
        htmlSelectors: {
            respondTo: async() => {
                return await document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3Jh10._1IiFg.f7WE2._3rat3 > div._3gSoe._35mGI > div").innerText.replace(/[\n.]/g, '')
            },
            answers: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3Jh10._1IiFg.f7WE2._3rat3 > div.PaKCO._1vQbM._1BTbT.ccJ7o").querySelectorAll(".ufykF")).map((item) => {
                    return item.querySelector("span:nth-child(2)").innerText;
                });
            },
            input: async() => {
                return await Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3Jh10._1IiFg.f7WE2._3rat3 > div.PaKCO._1vQbM._1BTbT.ccJ7o").querySelectorAll("._8dMUn")).map((item) => {
                    return item;
                });
            },
        },
        prompt: async function() {
            return await `(${userLanguage} to english) SYSTEM PROTOCOL [BLANK-FILL-8C] ROLE: Contextual index selector INPUT: "${await this.htmlSelectors.respondTo()}" OPTIONS: ${JSON.stringify(await this.htmlSelectors.answers())} <<RULES>> 1. ANALYZE: Blank position (start/middle/end) 2. SELECT: Best contextual fit from options 3. OUTPUT FORMAT: /^\\[\\d+\\]$/ (REGEX ENFORCED) 4. CONTEXT PRIORITY: - Before-text → Subject/action matching - After-text → Object/completion matching 5. STRICT PROHIBITIONS: - Explanations/letters → System crash - Multiple indexes → Data rejection EXAMPLE VALID OUTPUTS: [2] [0] [3] OUTPUT CHANNEL: RAW_CONTEXT_INDEX RESPONSE:`
        },
    },

    W: {
        htmlSelectors: {
            respondTo: async() => {
                return await document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.U41Ye > h1").innerText;
            },
            input: async() => {
                return await document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3X7QY > div > div._3l-7L > input")
            },
        },
        prompt: async function() {
            return await `(${userLanguage} to english) ${await this.htmlSelectors.respondTo()}, ONLY return the translation text string. No dialog.`
        },
    },

    W2: {
        htmlSelectors: {
            respondTo: async() => {
                return await document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.U41Ye > h1").innerText + " " + Array.from(document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.iPZZY.UjFh4._3rat3 > div._2w0y3._1dtTU._35mGI > div > div._1tbN5._44BHt > div > div").querySelectorAll("._5HFLU"))
                .map(item => item.innerText)
                .toString()
                .replace(/,/g, '');;
            },
            input: async() => {
                return await document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.iPZZY.UjFh4._3rat3 > div.u5Wzl._32LPr._3hg-V > div > textarea")
            },
        },
        prompt: async function() {
            return await `(${userLanguage} to english) ${await this.htmlSelectors.respondTo()}, ONLY return the translation text string. No dialog.`
        },
    },
};

if (!window.scriptLoaded) {
    window.scriptLoaded = true;

    window.AIFill = async function() {
        if (window.location.href.includes("https://www.duolingo.com/lesson") && Date.now() - lastCLick >= 200) {
            lastCLick = Date.now();

            let question = '',
                input = null,
                type = null,
                answers = [],
                AIreq = '';

            try {
                userLanguage = document.querySelector("head > title").innerText.split(' ').pop()
                question = document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.U41Ye > h1").innerText;

                if (typeof question == 'string') {
                    if (question == "Complete the chat") {
                        type = "CTC";

                        respondTo = await DuolingoSection.CTC.htmlSelectors.respondTo();
                        answers = await DuolingoSection.CTC.htmlSelectors.answers();
                        AIreq = await DuolingoSection.CTC.prompt();
                        input = await DuolingoSection.CTC.htmlSelectors.input();
                    } else if (question.includes("Write “")) {
                        type = "W";

                        AIreq = await DuolingoSection.W.prompt();
                        answers = 'filler';
                        input = await DuolingoSection.W.htmlSelectors.input();
                    } else if (question.includes("Write this in")) {
                        if (document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div.iPZZY.UjFh4._3rat3 > div.u5Wzl._32LPr._3hg-V > div > textarea")) {
                            type = "W2";

                            AIreq = await DuolingoSection.W2.prompt();
                            answers = 'filler';
                            input = await DuolingoSection.W2.htmlSelectors.input();
                        } else {
                            type = "WTI";

                            respondTo = await DuolingoSection.WTI.htmlSelectors.respondTo();
                            answers = await DuolingoSection.WTI.htmlSelectors.answers();
                            AIreq = await DuolingoSection.WTI.prompt();
                            input = await DuolingoSection.WTI.htmlSelectors.input();
                        }
                    } else if (question == "Select the correct meaning") {
                        type = "STCM";

                        respondTo = await DuolingoSection.STCM.htmlSelectors.respondTo();
                        answers = await DuolingoSection.STCM.htmlSelectors.answers();
                        AIreq = await DuolingoSection.STCM.prompt();
                        input = await DuolingoSection.STCM.htmlSelectors.input();
                    } else if (question == "Select the matching pairs") {
                        type = "STMP";

                        answers = await DuolingoSection.STMP.htmlSelectors.answers();
                        AIreq = await DuolingoSection.STMP.prompt();
                        input = await DuolingoSection.STMP.htmlSelectors.input();
                    } else if (question == "Fill in the blank") {
                        type = "FITB";

                        if (document.querySelector("#root > div.kPqwA._2kkzG > div._3yE3H > div > div.RMEuZ._1GVfY > div > div > div > div > div._3Jh10._1IiFg.f7WE2._3rat3 > div._3gSoe._35mGI > div")) {
                            respondTo = await DuolingoSection.FITB2.htmlSelectors.respondTo();
                            answers = await DuolingoSection.FITB2.htmlSelectors.answers();
                            AIreq = await DuolingoSection.FITB2.prompt();
                            input = await DuolingoSection.FITB2.htmlSelectors.input();
                        } else {
                            respondTo = await DuolingoSection.FITB.htmlSelectors.respondTo();
                            answers = await DuolingoSection.FITB.htmlSelectors.answers();
                            AIreq = await DuolingoSection.FITB.prompt();
                            input = await DuolingoSection.FITB.htmlSelectors.input();
                        }
                    } else if (question == "What do you hear?" || question == "Speak this sentence" || question == "Tap what you hear" || question == "Type what you hear") {
                        document.querySelector("#session\\/PlayerFooter > div > div._3h0lA > button").click();
                        return false;
                    } else {
                        // Skip the question AI not able to do
                        document.querySelector("#session\\/PlayerFooter > div > div._3h0lA").querySelector("button").click();
                        return false;
                    }

                    if (type && question && answers && input) {
                        data = {
                            type: type,
                            question: question,
                            answers: answers,
                            input: input,
                            result: ''
                        };
                    }

                    chrome.runtime.sendMessage({
                        question,
                        answers,
                        AIreq
                    });
                }
            } catch (e) {
                // Skip the question if error
                document.querySelector("#session\\/PlayerFooter > div > div._3h0lA").querySelector("button").click();
            }
        }
    }

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.action == "href?") {
            chrome.runtime.sendMessage({
                action: "href",
                data: window.location.href
            });
        } else if (message.action === "Fill") {
            AIFill();
            return false;
        }

        if (!message.result) {
            return false;
        }

        data.result = message.result;
        console.log(data.result);
        
        try {
            if (data?.result != undefined) {
                if (data.result == "ERROR") {
                    setTimeout(() => {
                        window.AIFill()
                    }, 200);
                } else if (data.type == "CTC") {
                    data.input[data.result.replace(/\D/g, '')].click();
                } else if (data.type == "STCM") {
                    data.input[data.result.replace(/\D/g, '')].click();
                } else if (data.type == "STMP") {
                    let arr = JSON.parse(data.result);
                    for (const item of arr) {
                        data.input[item].click();
                        await delay(500)
                    }
                } else if (data.type == "WTI") {
                    let arr = JSON.parse(data.result);
                    arr.forEach((item, i) => {
                        data.input[~~item].querySelector("span > button > span:nth-child(2) > span").innerText = i + 1;
                    });
                } else if (data.type == "FITB") {
                    data.input[data.result.replace(/\D/g, '')].click();
                } else if (data.type == "W") {
                    data.input.placeholder = "Type: " + data.result;
                } else if (data.type == "W2") {
                    data.input.placeholder = "Type: " + data.result;
                }
            }
        } catch (e) {
            setTimeout(() => {
                window.AIFill()
            }, 200);
        }
    });

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}