jQuery(document).ready(function() {
    //Declaration
    var myCharacter, opponentCharacter, choices, characterArray, selectedCharacter, selectedAttacker, numberEnemies, rounds;
    var wins = 0;
    var loses = 0;

    //Audio
    var battleSoundsArray = ["assets/audio/Battle1.mp3", "assets/audio/Battle2.mp3"];
    var heroSelectSound = ["assets/audio/HeroSelect1.mp3"];
    var heroDeathSound = ["assets/audio/Death1.mp3"];
    var winSound = ["assets/audio/RadiantVictory1.mp3", "assets/audio/DireVictory1.mp3"];
    var loseSound = ["assets/audio/RadiantLose1.mp3", "assets/audio/DireLose1.mp3"];

    var audio = document.createElement("audio");
    audio.setAttribute("src", heroSelectSound);
    var randNum = Math.floor(Math.random() * 2);
    var randBattleSound = battleSoundsArray[randNum];
    var randWinSound = winSound[randNum];
    var randLoseSound = loseSound[randNum];

    //Initialize
    function setVariables() {
        myCharacter;
        opponentCharacter;
        choices = [];
        characterArray = [{
            id: 0,
            name: "Dragon Knight",
            imageUrl: "assets/images/DragonKnight.png",
            healthPoints: 511,
            attackDamage: 53,
            counterAttackDamage: 50, 
        },{
            id: 1,
            name: "Drow Ranger",
            imageUrl: "assets/images/DrowRanger.jpg",
            healthPoints: 506,
            attackDamage: 55,
            counterAttackDamage: 44,
        },{
            id: 2,
            name: "Earthshaker",
            imageUrl: "assets/images/Earthshaker.jpeg",
            healthPoints: 568,
            attackDamage: 54,
            counterAttackDamage: 49,
        },{
            id: 3,
            name: "Storm Spirit",
            imageUrl: "assets/images/StormSpirit.jpg",
            healthPoints: 549,
            attackDamage: 51,
            counterAttackDamage: 46,
        }];
        selectedCharacter = false;
        selectedAttacker = false;
        numberEnemies = 3;
        rounds = 15;

        for (var i=0; i<characterArray.length; i++) {
            choices += "<div id=" + characterArray[i].id + " class='btn character text-center' value=" + characterArray[i].id + "><div class='character_name'>" + characterArray[i].name + "</div><img class='character_image' src=" + characterArray[i].imageUrl + " alt=" + characterArray[i].name + "><div class='character_health'>" + characterArray[i].healthPoints + "</div>" + "</div>";        
        }

        $("#characters_section").html(choices);
        $("#instructions").html("Click to Choose your Hero");

        $(".hero").remove();
        $(".enemy").remove();
        $("#gameMessage").html("");

        attachCharacterOnClick();
        audio.pause();
    }
    
    //Characters to HTML
    function executeCharacters() {
        var hero = "<div id=" + characterArray[myCharacter].id + " class='btn character text-center hero' value=" + characterArray[myCharacter].id + "><div class='character_name'>" + characterArray[myCharacter].name + "</div><img class='character_image' src=" + characterArray[myCharacter].imageUrl + " alt=" + characterArray[myCharacter].name + "><div class='hero_health'>" + characterArray[myCharacter].healthPoints + "</div>" + "</div>";
        var enemy = "<div id=" + characterArray[opponentCharacter].id + " class='btn character text-center enemy' value=" + characterArray[opponentCharacter].id + "><div class='character_name'>" + characterArray[opponentCharacter].name + "</div><img class='character_image' src=" + characterArray[opponentCharacter].imageUrl + " alt=" + characterArray[opponentCharacter].name + "><div class='enemy_health'>" + characterArray[opponentCharacter].healthPoints + "</div>" + "</div>";

        $("#selected_character").html(hero);
        $("#defenderSection").html(enemy);
    }

    //Action Read-out
    function gameMessage() {
        var gameStateMessage = "You attacked " + characterArray[opponentCharacter].name + " for " + characterArray[myCharacter].attackDamage + " damage!<br>" + characterArray[opponentCharacter].name + " counter attacks for " + characterArray[opponentCharacter].counterAttackDamage + " damage!<br>" +
        "Your attack damage has increased by " + rounds + "!!";

        $("#gameMessage").html(gameStateMessage);
    }
    
    //Clicking Characters
    function attachCharacterOnClick() {
        $(".character").on("click", function() {
            //Pick your Hero
            if (!selectedCharacter) {
                myCharacter = $(this).attr("id");
                $("#selected_character").append(this);
                $(this).addClass("hero");

                selectedCharacter = true;
                $("#gameMessage").html("");
                $("#instructions").html("Choose your Opponent!");
                //Play Hero Select sound
                audio.play();
            
            } //Pick your Opponent 
            else if (!selectedAttacker && selectedCharacter && myCharacter !== $(this).attr("id")){
                opponentCharacter = $(this).attr("id");
                $("#defenderSection").append(this);
                $(this).addClass("enemy");

                selectedAttacker = true;
                $("#gameMessage").html("");
                $("#instructions").html("Keep clicking Attack to fight!");

                audio.pause(); //Pause Hero Select sound
                audio.setAttribute("src", randBattleSound); //Set Battle sound
                audio.play(); //Play Battle sound

            }
        });
    }
    //Attack Button
    $("#attackBtn").on("click", function () {
        if (!selectedCharacter) {
            $("#gameMessage").text("You need to pick your Hero first!");
        } else if (!selectedAttacker) {
            $("#gameMessage").html("Pick who you are fighting!");
        } else if (selectedCharacter && selectedAttacker) {
            rounds++;

            //Attack Enemy
            characterArray[opponentCharacter].healthPoints = characterArray[opponentCharacter].healthPoints - characterArray[myCharacter].attackDamage;
            //Get Hit by Enemy
            characterArray[myCharacter].healthPoints = characterArray[myCharacter].healthPoints - characterArray[opponentCharacter].counterAttackDamage;

            if (characterArray[opponentCharacter].healthPoints < 0) {
                numberEnemies--;
                if(numberEnemies > 0) {
                    $(".enemy").remove();
                    $("#gameMessage").html("");
                    $("#instructions").html("Who will you fight next?");
                    selectedAttacker = false;
                    audio.pause(); //Pause Battle sound
                    audio.setAttribute("src", heroSelectSound); //Set Hero Select sound
                    audio.play(); //Play Hero Select sound for next round
                } else {
                    gameMessage();
                    $("#instructions").html("YOU WIN! Do You Want to Play Again?");
                    $("#gameMessage").html("Killing Spree!!!");
                    audio.pause(); //Pause Battle sound
                    audio.setAttribute("src", randWinSound); //Set Victory sound
                    audio.play(); //Play Victory sound
                    $("#attckBtn").html(" ");
                    $("#attackBtn").html("Play Again!").on("click", function(){location.reload()});
                    wins++;
                }
            } else if (characterArray[myCharacter].healthPoints < 0) {
                gameMessage();
                $("#instructions").html("Player Dead! Do you want to Play Again?");
                $("#gameMessage").html("You have been killed!!");
                audio.pause(); //Pause Battle sound
                audio.setAttribute("src", randLoseSound); //Set Lose sound
                audio.play(); //Play Lose sound
                $("#attackBtn").html(" ");
                $("#attackBtn").html("Restart Game").on("click", function(){location.reload()});
                loses++;
                // setVariables();
            } else {
                gameMessage();
                executeCharacters();
            }
            //Increase Attack Damage per click
            characterArray[myCharacter].attackDamage = characterArray[myCharacter].attackDamage + rounds;
        }
    });

    attachCharacterOnClick();
    setVariables();
    audio.pause();
});

// $(document).load(function() {

// });
