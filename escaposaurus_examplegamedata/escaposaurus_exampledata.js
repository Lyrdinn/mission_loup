<!--
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////
-->

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
		/*either online with VOD server and JSON load of data
		either local */
		var isLocal = true ;
 		var gameRoot = "./" ;
 		var gameDataRoot = gameRoot+"escaposaurus_examplegamedata/" ;
 		var videoRoot = gameDataRoot+"videos/" ;

 		/*caller app*/
		var contactVideoRoot = videoRoot+"contactVideo/" ;

		/*full path to intro / outro video*/
		var missionVideoPath = videoRoot+"intro1.mp4" ;
		var introVideoPath = videoRoot+"intro2.mp4" ;
		var missingVideoPath = videoRoot+"final.mp4" ;
		var epilogueVideoPath = videoRoot+"epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"udisk/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

		var udiskData =
	  	{"root":{
	  		"folders":
		  		[
		  		{"foldername":"armement",
				  	"files":[]
				},
				{"foldername":"dictionnaire",
				  	"files":[]
				},
				{"foldername":"region",
					"files":[]
				},
			  	{"foldername":"groupes", "password":"nom_region","sequence":0,
			  		"files":[],
			  		"folders":[{
						"foldername":"camp","password":"zelu","sequence":1,
						"files":[]
					}]
			  	},
				{"foldername":"gps", "password":"gps","sequence":2,
					"files":["coordonnees.txt"]
				}
		 		],
			"files":[]}
		} ;

		var gameTitle = "Mission loup" ;
		var gameDescriptionHome = "<br/>Deux touristes ont été témoin d un braconnage et ont trouvé une clé usb sur les lieux de lanimal enlevé. Votre mission, si vous lacceptez, est danalyser le contenu de cette clé pour retrouver le braconnier et sauver lanimal." ;
		var gameMissionCall = "Voici la vidéo que Lydia votre supérieure a envoyé à votre bureau d'informaticien spécialisé en récupération de données" ;
		var gameMissionAccept = "&raquo;&raquo; Accepter la mission et charger la clé USB dans le serveur virtuel (JOUER) &laquo;&laquo;" ;

		var gameCredit = "Un jeu conçu et réalisé par : <br/>Groupe 1" ;
		var gameThanks = "Remerciements : <br/> ;)" ;

		var OSName = "Special RangerOS 3.11- diskloaded: Mission Loup" ;
		var explorerName = "USB DISK EXPLORER" ;
		var callerAppName = "CALL CONTACT" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "INTRODUCTION" ;
		titleData.epilogueTitle = "EPILOGUE" ;
		titleData.callTitle = "APPEL EN COURS..." ;	

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Pas disponible pour le moment." ;
		var prompt = [] ;
		prompt[0] = "Prendre contact avec les touristes" ;
		prompt[1] = "Trouver la région ou les braconniers sont situes" ;
		prompt[2] = "Comprendre qui sont les braconniers" ;
		prompt[3] = "Trouver les coordonnées GPS" ;
		prompt[4] = "" ;

		/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 3 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "scan_memo.png" ;
		seqMainHint[1] = "aucun" ; /*if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence*/
		seqMainHint[2] = "aucun" ;
		seqMainHint[3] = "swisstopo-screen.png" ;

		/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
	their img need to be placed in their video folder, username is their displayed name
		*/
		var normalContacts = [] ;
		normalContacts[0] = {"vid" : "Nancy", "vod_folder" : "", "username" : "Nancy (garde forestiere)", "canal" : "video", "avatar" : "nancy.png"} ;
		normalContacts[1] = {"vid" : "Touristes", "vod_folder" : "", "username" : "Jean-Michel, Marie (touristes)", "canal" : "video", "avatar" : "touristes.png"} ;

		/*second part of the list, contact that can help the player*/
		var helperContacts = [] ;
		helperContacts[0] = {"vid" : "Lydia", "vod_folder" : "", "username" : "Lydia (pour avoir un indice)", "canal" : "txt", "avatar" : "lydia.png", "bigAvatar" : "lydiabig.png"} ;


		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "Coordonnées GPS transmises aux membres anti-braconnages." ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
		var missingContact = {"vid" : "missing", "vod_folder" : "","username" : "lydia",  "canal" : "video", "avatar" : "lydia.png"} ;

		/*Lou only send text message, they are stored here*/
		var tips = {} ;
		tips['Lydia'] = [] ;
		tips['Lydia'][0] = "Je ne peux pas répondre à votre appel." ;
		tips['Lydia'][1] = "" ;
		tips['Lydia'][2] = "" ;
		tips['Lydia'][3] = "" ;


		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez retrouvé l'id GPS et vous pouvez appeler les secours du secteur." ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Si Sabine a été secourue, le jeu est fini bravo." ;
		solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;