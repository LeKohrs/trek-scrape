'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');
var card = {};
var firebase = require("firebase");


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAxNL0WmIN-Jhg_4gPR6SEoNE_uawQDJeU",
    authDomain: "trek-deck.firebaseapp.com",
    databaseURL: "https://trek-deck.firebaseio.com",
    projectId: "trek-deck",
    storageBucket: "trek-deck.appspot.com",
    messagingSenderId: "1012680604434"
  };
  firebase.initializeApp(config);
  const dbRefObject = firebase.database().ref('/cards/');

(async () => {

    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    const new_data = [];
    const delay = time => new Promise(res => setTimeout(() => res(), time));

    await page.goto('https://www.trekcc.org', {
        waitUntil: 'networkidle'
    });
    await delay(1000);
    for (let i = 1922; i < 6000; i++) {
        let url = 'https://www.trekcc.org/1e/index.php?mode=card&cardID=' + i;
        await page.goto(url);

        let card = await page.evaluate((i) => {
            if(document.querySelector('#content') != null) {
                let newCard = {};
                let title = document.querySelector('#content > div:nth-child(2) > div > p > b').innerText;
                let text = document.querySelector('#content > div:nth-child(2) > div').innerText.replace(new RegExp('\n', 'g'), ' ').replace(new RegExp('\t', 'g'), ' ').replace(new RegExp('\'', 'g'), "'").replace('&nbsp', '');
                let textArray = text.split(' ');
                textArray = textArray.map(el => el.trim());
                // console.log(textArray);
                let icons = document.querySelectorAll('#content > div:nth-child(2) > div:first-child > p > img');
                let affiliations = [];
                if(icons.length > 0) {
                    for(let icon of icons) {
                        let affiliation = icon.alt;
                        if (affiliation == '[Kli]') {
                            affiliations.push('klingon');
                        } else if (affiliation == '[Fed]') {
                            affiliations.push('federation');
                        } else if (affiliation == '[Bor]') {
                            affiliations.push('borg');
                        } else if (affiliation == '[Baj]') {
                            affiliations.push('bajoran');
                        } else if (affiliation == '[Car]') {
                            affiliations.push('cardassian');
                        } else if (affiliation == '[Dom]') {
                            affiliations.push('dominion');
                        } else if (affiliation == '[Fer]') {
                            affiliations.push('ferengi');
                        } else if (affiliation == '[Hir]') {
                            affiliations.push('hirogen');
                        } else if (affiliation == '[Non]') {
                            affiliations.push('non-aligned');
                        } else if (affiliation == '[Kaz]') {
                            affiliations.push('kazon');
                        } else if (affiliation == '[Rom]') {
                            affiliations.push('romulan');
                        } else if (affiliation == '[Sta]') {
                            affiliations.push('starfleet');
                        } else if (affiliation == '[Vul]') {
                            affiliations.push('vulcan');
                        }
                    }
                    let otherIcons = [];
                    for(let icon of icons) {
                        let iconAlts = icon.alt;
                        if(iconAlts == '[DQ]') {
                            otherIcons.push('delta quadrant');
                        } else if (iconAlts == '[GQ]') {
                            otherIcons.push('gamma quadrant');
                        } else if (iconAlts == '[Stf]') {
                            otherIcons.push('staff');
                        } else if (iconAlts == '[Maq]') {
                            otherIcons.push('maquee');
                        } else if (iconAlts == '[Cmd]') {
                            otherIcons.push('command');
                        } else if (iconAlts == '[HA]') {
                            otherIcons.push('hidden agenda');
                        } else if (iconAlts == '[KW]') {
                            otherIcons.push('ketracel-white');
                        } else if (iconAlts == '[Nav]') {
                            otherIcons.push('navigation');
                        } else if (iconAlts == '[Com]') {
                            otherIcons.push('communications');
                        } else if (iconAlts == '[Def]') {
                            otherIcons.push('defence');
                        } else if (iconAlts == '[AU]') {
                            otherIcons.push('alternate universe');
                        } else if (iconAlts == '[MU]') {
                            otherIcons.push('mirror universe');
                        } else if (iconAlts == '[KCA]') {
                            otherIcons.push('alliance');
                        } else if (iconAlts == '[TE]') {
                            otherIcons.push('terran empire');
                        } else if (iconAlts == '[Ent-E]') {
                            otherIcons.push('enterprise e');
                        } else if (iconAlts == '[Films]') {
                            otherIcons.push('films');
                        } else if (iconAlts == '[OCD]') {
                            otherIcons.push('ocd');
                        } else if (iconAlts == '[OS]') {
                            otherIcons.push('original series');
                        } else if (iconAlts == '[1]' || iconAlts == '[2]' || iconAlts == '[3]' || iconAlts == '[4]' || iconAlts == '[X]') {
                            otherIcons.push('countdown');
                        } else if (iconAlts == '[BO]') {
                            otherIcons.push('borg card');
                        } else if (iconAlts == '[Holo]') {
                            otherIcons.push('hologram');
                        } else if (iconAlts == '[RC]') {
                            otherIcons.push('reactor core');
                        } else if (iconAlts == '[Pun]') {
                            otherIcons.push('punishment');
                        } else if (iconAlts == '[Orb]') {
                            otherIcons.push('orb');
                        } else if (iconAlts == '[Bar]') {
                            otherIcons.push('barash');
                        } else if (iconAlts == '[BB]') {
                            otherIcons.push('1e-bb');
                        } else if (iconAlts == '[Crime]') {
                            otherIcons.push('crime');
                        } else if (iconAlts == '[Pursuit]') {
                            otherIcons.push('pursuit');
                        } else if (iconAlts == '[Ref]') {
                            otherIcons.push('referee');
                        } else if (iconAlts == '[Rule]') {
                            otherIcons.push('rules of acquisition');
                        } else if (iconAlts == '[Sch]') {
                            otherIcons.push('scheme');
                        } else if (iconAlts == '[Self]') {
                            otherIcons.push('self');
                        } else if (iconAlts == '[WC]') {
                            otherIcons.push('warp core');
                        } else if (iconAlts == '[22]') {
                            otherIcons.push('22nd century');
                        } else if (iconAlts == '<Baj>') {
                            otherIcons.push('infiltrate bajoran');
                        } else if (iconAlts == '<Car>') {
                            otherIcons.push('infiltrate cardassian');
                        } else if (iconAlts == '<Dom>') {
                            otherIcons.push('infiltrate dominion');
                        } else if (iconAlts == '<Fed>') {
                            otherIcons.push('infiltrate federation');
                        } else if (iconAlts == '<Kli>') {
                            otherIcons.push('infiltrate klingon');
                        } else if (iconAlts == '<Maq>') {
                            otherIcons.push('infiltrate maquee');
                        } else if (iconAlts == '<Rom>') {
                            otherIcons.push('infiltrate romulan');
                        } else if (iconAlts == '<Sta>') {
                            otherIcons.push('infiltrate starfleet');
                        } else if (iconAlts == '<Vul>') {
                            otherIcons.push('infiltrate vulcan');
                        } else if (iconAlts == '(K>' || iconAlts == '<K)') {
                            otherIcons.push('nemesis black');
                        } else if (iconAlts == '(L>' || iconAlts == '<L)') {
                            otherIcons.push('nemesis blue');
                        } else if (iconAlts == '(P>') {
                            otherIcons.push('nemesis purple');
                        } else if (iconAlts == '(R>' || iconAlts == '<R)') {
                            otherIcons.push('nemesis red');
                        } else if (iconAlts == '(S>' || iconAlts == '<S)') {
                            otherIcons.push('nemesis silver');
                        } else if (iconAlts == '(Y>' || iconAlts == '<Y)') {
                            otherIcons.push('nemesis yellow');
                        } else if (iconAlts == '<G)') {
                            otherIcons.push('nemesis green');
                        }
                    }
                    newCard.icons = otherIcons;
                }
                if (text.indexOf('Range:') >= 0) {
                    var type = 'ship';
                    let range = textArray[textArray.indexOf('Range:') + 1].trim();
                    let weapons = textArray[textArray.indexOf('Weapons:') + 1].trim();
                    let shields = textArray[textArray.indexOf('Shields:') + 1].trim();
                    let staffIcons = [];
                    let staffIcon = document.querySelectorAll('#content > div:nth-child(2) > div:first-child > table > tbody > tr > td img');
                    for(let icon of staffIcon) {
                        let shipStaff = icon.alt;
                        if (shipStaff == '[Films]') {
                            staffIcons.push('films');
                        } else if (shipStaff == '[Stf]') {
                            staffIcons.push('staff');
                        } else if (shipStaff == '[AU]') {
                            staffIcons.push('alternate universe');
                        } else if (shipStaff == '[Cmd]') {
                            staffIcons.push('command');
                        }
                    }
                    if (document.querySelector('#content > div:nth-child(2) > div:first-child > table > tbody > tr > td:last-child')) {
                        let features = document.querySelector('#content > div:nth-child(2) > div:first-child > table > tbody > tr > td:last-child').innerText;
                        newCard.features = features;
                    }

                    newCard.type = type;
                    newCard.range = range;
                    newCard.weapons = weapons;
                    newCard.shields = shields;
                    newCard.staffIcons = staffIcons;
                    newCard.affiliation = affiliations;

                }
                if (text.indexOf('Strength:') >= 0) {
                    var type = 'personnel';
                    let integrity = textArray[textArray.indexOf('Integrity:') + 1].trim();
                    let cunning = textArray[textArray.indexOf('Cunning:') + 1].trim();
                    let strength = textArray[textArray.indexOf('Strength:') + 1].trim();
                    let skills = [];
                    let classifications = [];
                    for(let s of textArray) {
                        if(s.indexOf('•') >= 0) {
                            skills.push(s);
                        }
                    }

                    for(let s of textArray) {
                        if(s.indexOf('VIP') >= 0) {
                             classifications.push(s);
                        } else if(s.indexOf('CIVILIAN') >= 0) {
                             classifications.push(s);
                        } else if(s.indexOf('OFFICER') >= 0) {
                             classifications.push(s);
                        } else if(s.indexOf('SECURITY') >= 0) {
                             classifications.push(s);
                        } else if(s.indexOf('ENGINEER') >= 0) {
                             classifications.push(s);
                        } else if(s.indexOf('MEDICAL') >= 0) {
                             classifications.push(s);
                        } else if(s.indexOf('SCIENCE') >= 0) {
                             classifications.push(s);
                        } else if(s.indexOf('ANIMAL') >= 0) {
                             classifications.push(s);
                        }
                    }

                    newCard.classification = classifications[0];
                    newCard.skills = skills;
                    newCard.type = type;
                    newCard.integrity = integrity;
                    newCard.cunning = cunning;
                    newCard.strength = strength;
                }
                if (text.indexOf('Shields:') >= 0 && text.indexOf('Range:') < 0){
                    let type = 'facility';
                    if (text.indexOf('Weapons:') >= 0) {
                        let weapons = textArray[textArray.indexOf('Weapons:') + 1].charAt(0);
                        newCard.weapons = weapons;
                    }
                    let shields = textArray[textArray.indexOf('Shields:') + 1].trim();
                    newCard.shields = shields;
                    if (text.indexOf('Weapons:') >= 0) {
                        let shields = textArray[textArray.indexOf('Weapons:') + 2].trim();
                        newCard.shields = shields;
                    }
                    let stationIcons = document.querySelectorAll('#content > div:nth-child(2) > div:first-child > p > img')
                    let affiliations = [];
                    for(let icon of stationIcons) {
                        let affiliation = icon.alt;
                        if (affiliation == '[Kli]') {
                            affiliations.push('klingon');
                        } else if (affiliation == '[Fed]') {
                            affiliations.push('federation');
                        } else if (affiliation == '[Bor]') {
                            affiliations.push('borg');
                        } else if (affiliation == '[Baj]') {
                            affiliations.push('bajoran');
                        } else if (affiliation == '[Car]') {
                            affiliations.push('cardassian');
                        } else if (affiliation == '[Dom]') {
                            affiliations.push('dominion');
                        } else if (affiliation == '[Fer]') {
                            affiliations.push('ferengi');
                        } else if (affiliation == '[Hir]') {
                            affiliations.push('hirogen');
                        } else if (affiliation == '[Non]') {
                            affiliations.push('non-aligned');
                        } else if (affiliation == '[Kaz]') {
                            affiliations.push('kazon');
                        } else if (affiliation == '[Rom]') {
                            affiliations.push('romulan');
                        } else if (affiliation == '[Sta]') {
                            affiliations.push('starfleet');
                        } else if (affiliation == '[Vul]') {
                            affiliations.push('vulcan');
                        }
                    }
                    newCard.affiliations = affiliations;
                    newCard.type = type;

                }

                if (document.querySelector('#content div:nth-child(2) p img') != null) {
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Incident]') {
                        let type = 'incident';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Interrupt]') {
                        let type = 'interrupt';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Objective]') {
                        let type = 'objective';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Tribble]') {
                        let type = 'tribble';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Trouble]') {
                        let type = 'trouble';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Interrupt/Event]') {
                        let type = 'interrupt/event';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Artifact]') {
                        let type = 'artifact';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Damage Marker]') {
                        let type = 'damage marker';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Doorway]') {
                        let type = 'doorway';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Equipment]') {
                        let type = 'equipment';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Event]') {
                        let type = 'event';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Q]') {
                        let type = 'q';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[Tactic]') {
                        let type = 'tactic';
                        newCard.type = type;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[S]' && (text.indexOf('(Alpha)') >= 0 || text.indexOf('(Gamma)') >= 0 || text.indexOf('(Delta)') >= 0 || text.indexOf('(Mirror)') >= 0) && text.indexOf('Span:') <= 0) {
                        let type = 'time location';
                        let location = 'space';
                        newCard.type = type;
                        newCard.location = location;

                    } else if (document.querySelector('#content div:nth-child(2) p img').alt == '[S]' && text.indexOf('Span:') >= 0) {
                        let type = "misson";
                        let location = "space";
                        let span = textArray[textArray.indexOf('Span:') + 1].trim();
                        if (document.querySelector('#content div:nth-child(2) p span[style="background-color:black;border:2px ridge silver;color:white;padding:0px 5px;"]') != null) {
                            let points = document.querySelector('#content div:nth-child(2) p span[style="background-color:black;border:2px ridge silver;color:white;padding:0px 5px;"]').innerText;
                            newCard.points = points;
                        }

                        for(let icon of icons) {
                            let affiliation = icon.alt;
                            if (affiliation == '[KLI]') {
                                affiliations.push('klingon');
                            } else if (affiliation == '[FED]') {
                                affiliations.push('federation');
                            } else if (affiliation == '[BOR]') {
                                affiliations.push('borg');
                            } else if (affiliation == '[BAJ]') {
                                affiliations.push('bajoran');
                            } else if (affiliation == '[CAR]') {
                                affiliations.push('cardassian');
                            } else if (affiliation == '[DOM]') {
                                affiliations.push('dominion');
                            } else if (affiliation == '[FER]') {
                                affiliations.push('ferengi');
                            } else if (affiliation == '[HIR]') {
                                affiliations.push('hirogen');
                            } else if (affiliation == '[NON]') {
                                affiliations.push('non-aligned');
                            } else if (affiliation == '[KAZ]') {
                                affiliations.push('kazon');
                            } else if (affiliation == '[ROM]') {
                                affiliations.push('romulan');
                            } else if (affiliation == '[STA]') {
                                affiliations.push('starfleet');
                            } else if (affiliation == '[VUL]') {
                                affiliations.push('vulcan');
                            }
                        }

                        newCard.type = type;
                        newCard.location = location;
                        newCard.span = span;
                        newCard.affiliation = affiliations;

                    } else if (document.querySelector('#content div:nth-child(2) p img').alt == '[S]') {
                        let type = 'dilemma';
                        let location = 'space';
                        newCard.type = type;
                        newCard.location = location;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[P]' && (text.indexOf('(Alpha)') >= 0 || text.indexOf('(Gamma)') >= 0 || text.indexOf('(Delta)') >= 0 || text.indexOf('(Mirror)') >= 0) && text.indexOf('Span:') <= 0) {
                        let type = 'time location';
                        let location = 'planet';
                        newCard.type = type;
                        newCard.location = location;

                    } else if (document.querySelector('#content div:nth-child(2) p img').alt == '[P]' && text.indexOf('Span:') >= 0) {
                        let type = "misson";
                        let location = "planet";
                        let span = textArray[textArray.indexOf('Span:') + 1].trim();
                        let points = document.querySelector('#content div:nth-child(2) p span[style="background-color:black;border:2px ridge silver;color:white;padding:0px 5px;"]').innerText;
                        for(let icon of icons) {
                            let affiliation = icon.alt;
                            if (affiliation == '[KLI]') {
                                affiliations.push('klingon');
                            } else if (affiliation == '[FED]') {
                                affiliations.push('federation');
                            } else if (affiliation == '[BOR]') {
                                affiliations.push('borg');
                            } else if (affiliation == '[BAJ]') {
                                affiliations.push('bajoran');
                            } else if (affiliation == '[CAR]') {
                                affiliations.push('cardassian');
                            } else if (affiliation == '[DOM]') {
                                affiliations.push('dominion');
                            } else if (affiliation == '[FER]') {
                                affiliations.push('ferengi');
                            } else if (affiliation == '[HIR]') {
                                affiliations.push('hirogen');
                            } else if (affiliation == '[NON]') {
                                affiliations.push('non-aligned');
                            } else if (affiliation == '[KAZ]') {
                                affiliations.push('kazon');
                            } else if (affiliation == '[ROM]') {
                                affiliations.push('romulan');
                            } else if (affiliation == '[STA]') {
                                affiliations.push('starfleet');
                            } else if (affiliation == '[VUL]') {
                                affiliations.push('vulcan');
                            }
                        }

                        newCard.type = type;
                        newCard.location = location;
                        newCard.span = span;
                        newCard.points = points;
                        newCard.affiliation = affiliations;

                    } else if (document.querySelector('#content div:nth-child(2) p img').alt == '[P]') {
                        let type = 'dilemma';
                        let location = 'planet';
                        newCard.type = type;
                        newCard.location = location;
                    }
                    if (document.querySelector('#content div:nth-child(2) p img').alt == '[S/P]' && text.indexOf('Span:') >= 0) {
                        let type = "misson";
                        let location = "space";
                        let span = textArray[textArray.indexOf('Span:') + 1].trim();
                        let points = document.querySelector('#content div:nth-child(2) p span[style="background-color:black;border:2px ridge silver;color:white;padding:0px 5px;"]').innerText;
                        for(let icon of icons) {
                            let affiliation = icon.alt;
                            if (affiliation == '[KLI]') {
                                affiliations.push('klingon');
                            } else if (affiliation == '[FED]') {
                                affiliations.push('federation');
                            } else if (affiliation == '[BOR]') {
                                affiliations.push('borg');
                            } else if (affiliation == '[BAJ]') {
                                affiliations.push('bajoran');
                            } else if (affiliation == '[CAR]') {
                                affiliations.push('cardassian');
                            } else if (affiliation == '[DOM]') {
                                affiliations.push('dominion');
                            } else if (affiliation == '[FER]') {
                                affiliations.push('ferengi');
                            } else if (affiliation == '[HIR]') {
                                affiliations.push('hirogen');
                            } else if (affiliation == '[NON]') {
                                affiliations.push('non-aligned');
                            } else if (affiliation == '[KAZ]') {
                                affiliations.push('kazon');
                            } else if (affiliation == '[ROM]') {
                                affiliations.push('romulan');
                            } else if (affiliation == '[STA]') {
                                affiliations.push('starfleet');
                            } else if (affiliation == '[VUL]') {
                                affiliations.push('vulcan');
                            }
                        }

                        newCard.type = type;
                        newCard.location = location;
                        newCard.span = span;
                        newCard.points = points;
                        newCard.affiliation = affiliations;

                    } else if (document.querySelector('#content div:nth-child(2) p img').alt == '[S/P]') {
                        let type = 'dilemma';
                        let location = 'space/planet';
                        newCard.type = type;
                        newCard.location = location;
                    }
                }
                if (document.querySelector('#content div:nth-child(2) p img') == null && document.querySelector('#content div:nth-child(2) p') != null) {
                    let type = 'site';
                    newCard.type = type;
                }

                newCard.title = title;
                newCard.text = text;
                newCard.id = i;
                let imageUri = document.querySelector('#content > div:first-child > a:first-child img').href;
                let imageTitle = title.replace(/ /g, "").replace(/[^a-zA-Z ]/g, "");
                let imageName = 'image/' + imageTitle + '.png';
                newCard.img = imageName;

                return newCard;
            }
        }, i);
        try {
            // console.log(card);
            if(card != undefined) {
                var nameId = card.title.replace(/[^a-zA-Z ]/g, "").replace(/ /g, '');
                dbRefObject.child(nameId).set({
                    card
                }, function(error) {
                    if(error) {
                        // alert("Data could not be saved. " + error);
                    } else {
                        // alert("Data saved successfully.");
                    }
                });
                console.log(card);
            }
        } catch(e) {
            console.error(e)
        }

        let imageUri = await page.evaluate(() => {
            if(document.querySelector('#content') != null) {
                let imageUri = document.querySelector('#content > div:first-child > a:first-child img').src;

                return(imageUri);
            }
        });
        let title = await page.evaluate(() => {
            if(document.querySelector('#content') != null) {
                let title = document.querySelector('#content > div:nth-child(2) > div > p > b').innerText;

                return(title);
            }
        });
        if (title != undefined) {
            let imageTitle = title.replace(/ /g, "").replace(/[^a-zA-Z ]/g, "");
            let imageName = 'image/' + imageTitle + '.png';

            var download = function(uri, filename, callback){
              request.head(uri, function(err, res, body){
                // console.log('content-type:', res.headers['content-type']);
                // console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
              });
            };
            download(imageUri, imageName, function(){
              // console.log('done');
            });
        } else {
            console.log('no card!');
        }
    }
})();
