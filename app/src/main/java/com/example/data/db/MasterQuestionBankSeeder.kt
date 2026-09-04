package com.example.data.db

import com.example.data.model.Question
import java.util.Random

object MasterQuestionBankSeeder {

    const val TARGET_MASTER_COUNT = 10000

    /**
     * Hand-curated, foundational biblical questions that prioritize dialogue and
     * overarching biblical themes, completely free of chapter or verse citations in the query text.
     */
    fun getCuratedCoreQuestions(): List<Question> = listOf(
        Question(
            questionId = "BIB-000001",
            question = "Who built the ark to survive the great flood at God's command?",
            options = listOf("Abraham", "Noah", "Moses", "David"),
            correctAnswer = "Noah",
            book = "Genesis",
            chapter = 6,
            verse = 14,
            category = "Old Testament",
            difficulty = "Easy",
            explanation = "Noah's obedience to build the ark highlights the central biblical theme of salvation by grace through faith, preserving a righteous remnant amidst widespread moral decay."
        ),
        Question(
            questionId = "BIB-000002",
            question = "Who was swallowed by a great fish after fleeing God's command to preach repentance to Nineveh?",
            options = listOf("Elijah", "Jonah", "Ezekiel", "Daniel"),
            correctAnswer = "Jonah",
            book = "Jonah",
            chapter = 1,
            verse = 17,
            category = "Prophets",
            difficulty = "Easy",
            explanation = "Jonah's deliverance from the sea creature's belly points to God's sovereign universal mercy toward Gentile nations and serves as a prophetic sign of Christ's resurrection after three days."
        ),
        Question(
            questionId = "BIB-000003",
            question = "What body of water did Moses stretch out his staff over so the Israelites could escape on dry ground?",
            options = listOf("Dead Sea", "Sea of Galilee", "Red Sea", "Mediterranean Sea"),
            correctAnswer = "Red Sea",
            book = "Exodus",
            chapter = 14,
            verse = 21,
            category = "Pentateuch",
            difficulty = "Easy",
            explanation = "The parting of the Red Sea stands as the supreme Old Testament type of divine deliverance and baptism, demonstrating that salvation is entirely the supernatural work of the Lord."
        ),
        Question(
            questionId = "BIB-000004",
            question = "Which young shepherd boy defeated the giant Goliath with a sling and a stone?",
            options = listOf("Saul", "Solomon", "Jonathan", "David"),
            correctAnswer = "David",
            book = "1 Samuel",
            chapter = 17,
            verse = 49,
            category = "Old Testament",
            difficulty = "Easy",
            explanation = "David's victory illustrates the overarching scriptural theme that spiritual battles belong to the Lord, triumphing through humble faith rather than human armor or worldly might."
        ),
        Question(
            questionId = "BIB-000005",
            question = "Who was visited by the angel Gabriel and chosen to be the earthly mother of Jesus?",
            options = listOf("Martha", "Mary", "Elizabeth", "Anna"),
            correctAnswer = "Mary",
            book = "Luke",
            chapter = 1,
            verse = 30,
            category = "Gospels",
            difficulty = "Easy",
            explanation = "Mary's humble submission exemplifies the biblical theme of divine favor resting upon the lowly, fulfilling ancient prophecies of the seed of the woman bringing forth the Messiah."
        ),
        Question(
            questionId = "BIB-000006",
            question = "In what historic town of Judah was Jesus Christ born in fulfillment of messianic prophecy?",
            options = listOf("Nazareth", "Jerusalem", "Bethlehem", "Jericho"),
            correctAnswer = "Bethlehem",
            book = "Matthew",
            chapter = 2,
            verse = 1,
            category = "Gospels",
            difficulty = "Easy",
            explanation = "Christ's birth in Bethlehem fulfills ancient prophetic promises connecting the Messiah to the ancestral lineage and royal city of King David."
        ),
        Question(
            questionId = "BIB-000007",
            question = "How many days and nights did Jesus fast in the wilderness while resisting the devil's temptations?",
            options = listOf("7", "12", "40", "100"),
            correctAnswer = "40",
            book = "Matthew",
            chapter = 4,
            verse = 2,
            category = "Gospels",
            difficulty = "Easy",
            explanation = "Christ's forty-day fast recalls Israel's forty years in the wilderness, showing Jesus as the faithful Son who triumphs where humanity stumbled by relying solely on the living Word of God."
        ),
        Question(
            questionId = "BIB-000008",
            question = "Which disciple betrayed Jesus to the chief priests for thirty pieces of silver?",
            options = listOf("Judas Iscariot", "Peter", "Pontius Pilate", "Thomas"),
            correctAnswer = "Judas Iscariot",
            book = "Matthew",
            chapter = 26,
            verse = 15,
            category = "Gospels",
            difficulty = "Easy",
            explanation = "Judas's betrayal demonstrates the tragic deceitfulness of covetousness, while highlighting how God's sovereign redemptive plan orchestrates even human treachery toward Calvary."
        ),
        Question(
            questionId = "BIB-000009",
            question = "Who experienced a blinding encounter with the risen Christ on the road to Damascus before becoming an apostle to the nations?",
            options = listOf("Barnabas", "Saul (Paul)", "Silas", "Stephen"),
            correctAnswer = "Saul (Paul)",
            book = "Acts",
            chapter = 9,
            verse = 3,
            category = "Acts & Epistles",
            difficulty = "Easy",
            explanation = "Paul's radical conversion illustrates the biblical theme of sovereign, irresistible grace transforming a fierce enemy of the faith into a tireless missionary of the Gospel."
        ),
        Question(
            questionId = "BIB-000010",
            question = "Which poetic song in the biblical Psalter is celebrated as an extended acrostic meditating upon the perfection of God's Word?",
            options = listOf("Psalm 23", "Psalm 119", "Isaiah 53", "Genesis 1"),
            correctAnswer = "Psalm 119",
            book = "Psalms",
            chapter = 119,
            verse = 1,
            category = "Wisdom & Poetry",
            difficulty = "Medium",
            explanation = "This great psalm elevates the theme of divine revelation as an unwavering lamp to the believer's feet, guiding moral sanctification, wisdom, and eternal comfort."
        ),
        Question(
            questionId = "BIB-000011",
            question = "Who was cast into a den of lions for refusing to suspend his daily prayers to God?",
            options = listOf("Shadrach", "Daniel", "Meshach", "Abednego"),
            correctAnswer = "Daniel",
            book = "Daniel",
            chapter = 6,
            verse = 16,
            category = "Prophets",
            difficulty = "Easy",
            explanation = "Daniel's preservation in the lions' den illustrates that God honors steadfast covenant integrity over imperial decrees, proving the supremacy of the Kingdom of Heaven."
        ),
        Question(
            questionId = "BIB-000012",
            question = "Which prophetic figure is remembered as the 'weeping prophet' for mourning over the spiritual unfaithfulness and exile of Jerusalem?",
            options = listOf("Jeremiah", "Isaiah", "Amos", "Hosea"),
            correctAnswer = "Jeremiah",
            book = "Jeremiah",
            chapter = 9,
            verse = 1,
            category = "Prophets",
            difficulty = "Medium",
            explanation = "Jeremiah's sorrow embodies the pastoral heart of God yearning over a straying people, anticipating the promise of an inward New Covenant written directly upon human hearts."
        ),
        Question(
            questionId = "BIB-000013",
            question = "Which Roman governor presided over the trial of Jesus and washed his hands before the crowd to disclaim responsibility?",
            options = listOf("Felix", "Festus", "Pontius Pilate", "Herod Agrippa"),
            correctAnswer = "Pontius Pilate",
            book = "Matthew",
            chapter = 27,
            verse = 24,
            category = "Gospels",
            difficulty = "Easy",
            explanation = "Pilate's symbolic washing of his hands represents the tragic futility of moral neutrality when confronted with the claims of the righteous Son of God."
        ),
        Question(
            questionId = "BIB-000014",
            question = "What virtue is celebrated first among the Fruit of the Spirit in apostolic teaching?",
            options = listOf("Joy", "Peace", "Love", "Patience"),
            correctAnswer = "Love",
            book = "Galatians",
            chapter = 5,
            verse = 22,
            category = "Acts & Epistles",
            difficulty = "Easy",
            explanation = "Love ('agape') is the foundational fruit and animating pulse of the Christian life, reflecting God's sacrificial character and fulfilling the royal law of the Kingdom."
        ),
        Question(
            questionId = "BIB-000015",
            question = "Who was Abraham's firstborn son through Hagar before Isaac was born?",
            options = listOf("Isaac", "Ishmael", "Jacob", "Esau"),
            correctAnswer = "Ishmael",
            book = "Genesis",
            chapter = 16,
            verse = 15,
            category = "Pentateuch",
            difficulty = "Medium",
            explanation = "The story of Ishmael and Isaac contrasts human striving through the flesh with waiting upon God's sovereign covenant promise, a theme later developed in apostolic teaching on grace."
        ),
        Question(
            questionId = "BIB-000016",
            question = "What was the name of the primordial garden where humanity first enjoyed uninterrupted fellowship with the Creator?",
            options = listOf("Gethsemane", "Eden", "Babylon", "Carmel"),
            correctAnswer = "Eden",
            book = "Genesis",
            chapter = 2,
            verse = 8,
            category = "Pentateuch",
            difficulty = "Easy",
            explanation = "Eden represents God's original design of harmony between heaven and earth, a sacred communion that is ultimately restored and surpassed in the New Jerusalem."
        ),
        Question(
            questionId = "BIB-000017",
            question = "Who led the Israelites around the fortified walls of Jericho until they miraculously collapsed?",
            options = listOf("Caleb", "Joshua", "Gideon", "Samson"),
            correctAnswer = "Joshua",
            book = "Joshua",
            chapter = 6,
            verse = 20,
            category = "Old Testament",
            difficulty = "Easy",
            explanation = "The fall of Jericho demonstrates that victory over seemingly impregnable fortresses comes through precise obedience and faith in God's divine battle plan."
        ),
        Question(
            questionId = "BIB-000018",
            question = "How many miraculous plagues did the Lord send upon Egypt to break Pharaoh's resistance and liberate His people?",
            options = listOf("7", "10", "12", "40"),
            correctAnswer = "10",
            book = "Exodus",
            chapter = 7,
            verse = 14,
            category = "Pentateuch",
            difficulty = "Easy",
            explanation = "The ten plagues demonstrated the Lord's absolute sovereignty over all the false deities of Egypt, culminating in the Passover lamb that shielded Israel from judgment."
        ),
        Question(
            questionId = "BIB-000019",
            question = "Which king asked God for a discerning heart to govern with justice rather than asking for wealth or military triumph?",
            options = listOf("David", "Solomon", "Hezekiah", "Josiah"),
            correctAnswer = "Solomon",
            book = "1 Kings",
            chapter = 3,
            verse = 9,
            category = "Old Testament",
            difficulty = "Easy",
            explanation = "Solomon's prayer for wisdom illustrates that servant leadership aligned with God's righteousness receives both divine insight and providential blessing."
        ),
        Question(
            questionId = "BIB-000020",
            question = "What was Matthew's profession before he surrendered all to follow Jesus as a disciple?",
            options = listOf("Fisherman", "Tax Collector", "Tentmaker", "Pharisee"),
            correctAnswer = "Tax Collector",
            book = "Matthew",
            chapter = 9,
            verse = 9,
            category = "Gospels",
            difficulty = "Easy",
            explanation = "The calling of Matthew underscores the gospel theme of scandalous grace: Christ calls despised social outcasts into apostolic leadership, declaring He came to call sinners, not the self-righteous."
        )
    )

    /**
     * Authentic Scriptural Dialogue Data for 'Who said to whom' questions.
     * Stored with authentic biblical metadata (book, chapter, verse) while strictly
     * ensuring no chapter or verse numbers are embedded into query texts.
     */
    data class DialogueItem(
        val quote: String,
        val speaker: String,
        val recipient: String,
        val speakerDistractors: List<String>,
        val recipientDistractors: List<String>,
        val pairDistractors: List<String>,
        val book: String,
        val chapter: Int,
        val verse: Int,
        val category: String,
        val difficulty: String,
        val thematicExplanation: String
    )

    val dialogueBank: List<DialogueItem> = listOf(
        DialogueItem(
            quote = "Am I my brother's keeper?",
            speaker = "Cain",
            recipient = "The Lord",
            speakerDistractors = listOf("Esau", "Lamech", "Nimrod"),
            recipientDistractors = listOf("Adam", "Abel", "Eve"),
            pairDistractors = listOf("Esau to Isaac", "Joseph to his brothers", "Saul to Samuel"),
            book = "Genesis",
            chapter = 4,
            verse = 9,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "This piercing question underscores the biblical theme of human moral responsibility and covenant stewardship toward one's brother, contrasting Cain's bitter alienation with God's overarching call to love and protect our neighbor throughout Scripture."
        ),
        DialogueItem(
            quote = "Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.",
            speaker = "Ruth",
            recipient = "Naomi",
            speakerDistractors = listOf("Orpah", "Hannah", "Rahab"),
            recipientDistractors = listOf("Boaz", "Hannah", "Sarah"),
            pairDistractors = listOf("Hannah to Eli", "Esther to Mordecai", "Mary to Elizabeth"),
            book = "Ruth",
            chapter = 1,
            verse = 16,
            category = "Old Testament",
            difficulty = "Easy",
            thematicExplanation = "Ruth's vow exemplifies 'hesed'—steadfast covenant loyalty and selfless devotion—leading directly to her incorporation into the messianic genealogy of King David and Jesus Christ."
        ),
        DialogueItem(
            quote = "You come against me with sword and spear and javelin, but I come against you in the name of the Lord Almighty, the God of the armies of Israel, whom you have defied.",
            speaker = "David",
            recipient = "Goliath",
            speakerDistractors = listOf("Jonathan", "Saul", "Joab"),
            recipientDistractors = listOf("King Saul", "Abner", "Doeg"),
            pairDistractors = listOf("Jonathan to the Philistine garrison", "Joshua to the Canaanite kings", "Gideon to the Midianites"),
            book = "1 Samuel",
            chapter = 17,
            verse = 45,
            category = "Old Testament",
            difficulty = "Easy",
            thematicExplanation = "Spoken by David, this reflects the central biblical theme that spiritual battles belong to the Lord, demonstrating that divine deliverance is achieved through faith in God rather than reliance on human military power or weapons."
        ),
        DialogueItem(
            quote = "As for me and my household, we will serve the Lord.",
            speaker = "Joshua",
            recipient = "The assembly of Israel",
            speakerDistractors = listOf("Caleb", "Moses", "Phinehas"),
            recipientDistractors = listOf("The elders of Egypt", "The Canaanites", "The Levites"),
            pairDistractors = listOf("Moses to Pharaoh", "Caleb to the spies", "Samuel to King Saul"),
            book = "Joshua",
            chapter = 24,
            verse = 15,
            category = "Old Testament",
            difficulty = "Easy",
            thematicExplanation = "Joshua's farewell declaration highlights the biblical theme of intentional covenant commitment, calling God's people to make an unequivocal choice between true worship and cultural idolatry."
        ),
        DialogueItem(
            quote = "Speak, Lord, for your servant is listening.",
            speaker = "Samuel",
            recipient = "The Lord",
            speakerDistractors = listOf("David", "Eli", "Solomon"),
            recipientDistractors = listOf("Eli the priest", "King Saul", "Hannah"),
            pairDistractors = listOf("Eli to Samuel", "David to Nathan", "Solomon to the elders"),
            book = "1 Samuel",
            chapter = 3,
            verse = 10,
            category = "Old Testament",
            difficulty = "Easy",
            thematicExplanation = "Samuel's response embodies the posture of humble spiritual attentiveness and readiness to receive God's prophetic word, in stark contrast to the spiritual lethargy and corruption of Eli's sons."
        ),
        DialogueItem(
            quote = "You are the man!",
            speaker = "Nathan",
            recipient = "King David",
            speakerDistractors = listOf("Samuel", "Elijah", "Gad"),
            recipientDistractors = listOf("King Saul", "Absalom", "Solomon"),
            pairDistractors = listOf("Samuel to King Saul", "Elijah to King Ahab", "John the Baptist to Herod"),
            book = "2 Samuel",
            chapter = 12,
            verse = 7,
            category = "Old Testament",
            difficulty = "Medium",
            thematicExplanation = "Prophet Nathan's fearless confrontation of David's sin illustrates the prophetic theme of divine justice holding even the highest earthly rulers accountable to God's moral law, leading to brokenhearted repentance and restoration."
        ),
        DialogueItem(
            quote = "How long will you waver between two opinions? If the Lord is God, follow him; but if Baal is God, follow him.",
            speaker = "Elijah",
            recipient = "The people of Israel",
            speakerDistractors = listOf("Elisha", "Micaiah", "Jehu"),
            recipientDistractors = listOf("The prophets of Asherah", "King Ahab", "Jezebel"),
            pairDistractors = listOf("Elisha to the king of Israel", "Joshua to the tribes", "Jeremiah to Jerusalem"),
            book = "1 Kings",
            chapter = 18,
            verse = 21,
            category = "Prophets",
            difficulty = "Medium",
            thematicExplanation = "Elijah's challenge on Mount Carmel confronts the peril of spiritual compromise and syncretism, proclaiming the biblical theme of God's absolute uniqueness and requirement of undivided heart devotion."
        ),
        DialogueItem(
            quote = "If I perish, I perish.",
            speaker = "Esther",
            recipient = "Mordecai",
            speakerDistractors = listOf("Ruth", "Vashti", "Hannah"),
            recipientDistractors = listOf("King Xerxes", "Haman", "Hegai"),
            pairDistractors = listOf("Ruth to Boaz", "Deborah to Barak", "Hannah to Eli"),
            book = "Esther",
            chapter = 4,
            verse = 16,
            category = "Old Testament",
            difficulty = "Easy",
            thematicExplanation = "Esther's brave resolve embodies the biblical theme of providential timing and sacrificial courage, trusting God's sovereign deliverance of His covenant people even at the risk of one's own life."
        ),
        DialogueItem(
            quote = "The Lord gave and the Lord has taken away; may the name of the Lord be praised.",
            speaker = "Job",
            recipient = "His companions",
            speakerDistractors = listOf("Elihu", "Eliphaz", "Bildad"),
            recipientDistractors = listOf("The messengers of disaster", "The Chaldeans", "His children"),
            pairDistractors = listOf("Eliphaz to Job", "Elihu to Job", "Jeremiah to Baruch"),
            book = "Job",
            chapter = 1,
            verse = 21,
            category = "Wisdom & Poetry",
            difficulty = "Easy",
            thematicExplanation = "Job's worship amidst catastrophe illuminates the theme of transcendent trust in God's sovereign goodness, refusing to base worship on transactional earthly prosperity."
        ),
        DialogueItem(
            quote = "Let my people go, that they may hold a festival to me in the wilderness.",
            speaker = "Moses and Aaron",
            recipient = "Pharaoh",
            speakerDistractors = listOf("Joshua and Caleb", "Eldad and Medad", "Nadab and Abihu"),
            recipientDistractors = listOf("The elders of Israel", "Jethro", "The taskmasters of Egypt"),
            pairDistractors = listOf("Joshua to the kings of Canaan", "Elijah to King Ahab", "Samuel to King Saul"),
            book = "Exodus",
            chapter = 5,
            verse = 1,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "This demand captures the central redemptive theme of the Exodus: God liberating His people from earthly bondage so they may worship and serve Him in covenant freedom."
        ),
        DialogueItem(
            quote = "Take off your sandals, for the place where you are standing is holy ground.",
            speaker = "The Lord",
            recipient = "Moses",
            speakerDistractors = listOf("The Angel of the Covenant", "Jethro", "Aaron"),
            recipientDistractors = listOf("Joshua", "Abraham", "Gideon"),
            pairDistractors = listOf("The Commander of the Lord's Army to Joshua", "The Angel Gabriel to Zechariah", "Melchizedek to Abraham"),
            book = "Exodus",
            chapter = 3,
            verse = 5,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "At the burning bush, this divine command establishes the biblical theme of divine holiness, revealing that communion with the holy God demands reverence, humility, and purity."
        ),
        DialogueItem(
            quote = "The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart.",
            speaker = "The Lord",
            recipient = "Samuel",
            speakerDistractors = listOf("Nathan", "Gad", "Eli"),
            recipientDistractors = listOf("Jesse", "David", "Eliab"),
            pairDistractors = listOf("Nathan to David", "Samuel to Jesse", "Eli to Hannah"),
            book = "1 Samuel",
            chapter = 16,
            verse = 7,
            category = "Old Testament",
            difficulty = "Easy",
            thematicExplanation = "This principle encapsulates the biblical theme of divine evaluation, showing that God chooses leaders based on inner integrity and spiritual devotion rather than external impressiveness."
        ),
        DialogueItem(
            quote = "Ask for whatever you want me to give you.",
            speaker = "The Lord",
            recipient = "Solomon",
            speakerDistractors = listOf("David", "Nathan", "Ahijah"),
            recipientDistractors = listOf("David", "Hezekiah", "Josiah"),
            pairDistractors = listOf("Nathan to David", "David to Solomon", "Elijah to Elisha"),
            book = "1 Kings",
            chapter = 3,
            verse = 5,
            category = "Old Testament",
            difficulty = "Medium",
            thematicExplanation = "This divine offer highlights the theme of wisdom and selfless leadership, as Solomon requested a discerning heart to serve God's people justly rather than seeking personal wealth or glory."
        ),
        DialogueItem(
            quote = "Do not be afraid, for those who are with us are more than those who are with them.",
            speaker = "Elisha",
            recipient = "His servant",
            speakerDistractors = listOf("Elijah", "Gehazi", "Micaiah"),
            recipientDistractors = listOf("The king of Israel", "Naaman", "Hazael"),
            pairDistractors = listOf("Elijah to the widow of Zarephath", "Joshua to Caleb", "Jonathan to his armor-bearer"),
            book = "2 Kings",
            chapter = 6,
            verse = 16,
            category = "Old Testament",
            difficulty = "Medium",
            thematicExplanation = "Elisha's assurance reveals the unseen reality of heavenly protection, emphasizing the theme that spiritual perception through faith reveals God's overwhelming host surrounding His servants."
        ),
        DialogueItem(
            quote = "If we are thrown into the blazing furnace, the God we serve is able to deliver us... but even if he does not, we want you to know, Your Majesty, that we will not serve your gods.",
            speaker = "Shadrach, Meshach, and Abednego",
            recipient = "King Nebuchadnezzar",
            speakerDistractors = listOf("Daniel and his companions", "Zerubbabel and Joshua", "Ezra and Nehemiah"),
            recipientDistractors = listOf("King Belshazzar", "King Darius", "King Cyrus"),
            pairDistractors = listOf("Daniel to King Darius", "Jeremiah to King Zedekiah", "Mordecai to Haman"),
            book = "Daniel",
            chapter = 3,
            verse = 17,
            category = "Prophets",
            difficulty = "Medium",
            thematicExplanation = "This statement represents the pinnacle of resolute biblical faith: trusting God's ability to save, yet offering unwavering loyalty regardless of earthly outcome."
        ),
        DialogueItem(
            quote = "Here am I. Send me!",
            speaker = "Isaiah",
            recipient = "The Lord",
            speakerDistractors = listOf("Jeremiah", "Ezekiel", "Amos"),
            recipientDistractors = listOf("The Seraphim", "King Uzziah", "The people of Judah"),
            pairDistractors = listOf("Jeremiah to the Lord", "Samuel to Eli", "Moses to the Lord"),
            book = "Isaiah",
            chapter = 6,
            verse = 8,
            category = "Prophets",
            difficulty = "Easy",
            thematicExplanation = "Isaiah's response reflects the biblical dynamic of cleansing and commission: having experienced divine atonement, the redeemed believer responds with eager, unconditional surrender to God's mission."
        ),
        DialogueItem(
            quote = "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.",
            speaker = "Joseph",
            recipient = "His brothers",
            speakerDistractors = listOf("Judah", "Benjamin", "Jacob"),
            recipientDistractors = listOf("Potiphar", "Pharaoh", "The cupbearer"),
            pairDistractors = listOf("Jacob to his sons", "Judah to Joseph", "Moses to the Israelites"),
            book = "Genesis",
            chapter = 50,
            verse = 20,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "This triumphant declaration encapsulates the theological theme of divine providence, demonstrating how God weaves human betrayal into a master tapestry of salvation and mercy."
        ),
        DialogueItem(
            quote = "I will not let you go unless you bless me.",
            speaker = "Jacob",
            recipient = "The Angel of the Lord",
            speakerDistractors = listOf("Abraham", "Isaac", "Esau"),
            recipientDistractors = listOf("Laban", "Esau", "Isaac"),
            pairDistractors = listOf("Abraham to Melchizedek", "Isaac to Abimelech", "Moses to Jethro"),
            book = "Genesis",
            chapter = 32,
            verse = 26,
            category = "Pentateuch",
            difficulty = "Medium",
            thematicExplanation = "Jacob wrestling at Peniel portrays the transformative journey of faith, where a deceptive striver is broken of self-reliance and clings desperately to God's covenant grace alone."
        ),
        DialogueItem(
            quote = "Look, the fire and wood are here, but where is the lamb for the burnt offering?",
            speaker = "Isaac",
            recipient = "Abraham",
            speakerDistractors = listOf("Ishmael", "Eliezer", "Lot"),
            recipientDistractors = listOf("Sarah", "Melchizedek", "Abimelech"),
            pairDistractors = listOf("Joseph to Jacob", "Jonathan to Saul", "Solomon to David"),
            book = "Genesis",
            chapter = 22,
            verse = 7,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "Isaac's question on Mount Moriah foreshadows the central gospel theme of substitutionary atonement, answered by Abraham's prophetic faith that 'God himself will provide the lamb.'"
        ),
        DialogueItem(
            quote = "I am the Lord's servant. May your word to me be fulfilled.",
            speaker = "Mary",
            recipient = "The Angel Gabriel",
            speakerDistractors = listOf("Elizabeth", "Anna", "Martha"),
            recipientDistractors = listOf("Zechariah", "Joseph", "Simeon"),
            pairDistractors = listOf("Elizabeth to Zechariah", "Hannah to Eli", "Sarah to the three visitors"),
            book = "Luke",
            chapter = 1,
            verse = 38,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Mary's surrender models the biblical posture of faith and submission, willingly offering herself as the vessel through which the redemptive Incarnation entered human history."
        ),
        DialogueItem(
            quote = "Look, the Lamb of God, who takes away the sin of the world!",
            speaker = "John the Baptist",
            recipient = "The crowd and his disciples",
            speakerDistractors = listOf("Peter", "Andrew", "Nathanael"),
            recipientDistractors = listOf("The Pharisees", "King Herod", "The Roman soldiers"),
            pairDistractors = listOf("Peter to the crowd", "Philip to Nathanael", "Simeon to Mary"),
            book = "John",
            chapter = 1,
            verse = 29,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "John's testimony directly connects Old Testament sacrificial imagery—from the Passover lamb to Isaiah's suffering servant—to Jesus Christ as the singular, universal atoning sacrifice."
        ),
        DialogueItem(
            quote = "You are the Messiah, the Son of the living God.",
            speaker = "Peter",
            recipient = "Jesus",
            speakerDistractors = listOf("John", "James", "Andrew"),
            recipientDistractors = listOf("John the Baptist", "The High Priest", "Pontius Pilate"),
            pairDistractors = listOf("Nathanael to Philip", "Martha to Mary", "Thomas to the disciples"),
            book = "Matthew",
            chapter = 16,
            verse = 16,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Peter's great confession stands as the bedrock declaration of Christ's divine identity and messianic mission, revealed not by flesh and blood but by the Father in heaven."
        ),
        DialogueItem(
            quote = "Get behind me, Satan! You are a stumbling block to me; you do not have in mind the concerns of God, but merely human concerns.",
            speaker = "Jesus",
            recipient = "Peter",
            speakerDistractors = listOf("John the Baptist", "Paul", "Stephen"),
            recipientDistractors = listOf("Judas Iscariot", "The Pharisees", "Pontius Pilate"),
            pairDistractors = listOf("Jesus to Judas Iscariot", "Paul to Peter", "Peter to Simon the Sorcerer"),
            book = "Matthew",
            chapter = 16,
            verse = 23,
            category = "Gospels",
            difficulty = "Medium",
            thematicExplanation = "Christ's sharp rebuke underscores the divine necessity of the Cross, rejecting any worldly temptation to circumvent suffering and achieve redemption through earthly power."
        ),
        DialogueItem(
            quote = "Lord, if it is you, tell me to come to you on the water.",
            speaker = "Peter",
            recipient = "Jesus",
            speakerDistractors = listOf("John", "James", "Thomas"),
            recipientDistractors = listOf("Andrew", "Philip", "Matthew"),
            pairDistractors = listOf("John to Jesus", "Andrew to Jesus", "James to John"),
            book = "Matthew",
            chapter = 14,
            verse = 28,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Peter stepping out onto the stormy sea illustrates bold faith stepping beyond human limitations at Christ's command, accompanied by the lesson to keep one's eyes focused solely on the Savior."
        ),
        DialogueItem(
            quote = "Lord, to whom shall we go? You have the words of eternal life.",
            speaker = "Peter",
            recipient = "Jesus",
            speakerDistractors = listOf("Thomas", "Nathanael", "Philip"),
            recipientDistractors = listOf("John the Baptist", "The apostles", "The crowd"),
            pairDistractors = listOf("Thomas to Jesus", "Philip to Jesus", "John to Peter"),
            book = "John",
            chapter = 6,
            verse = 68,
            category = "Gospels",
            difficulty = "Medium",
            thematicExplanation = "When others deserted after difficult teachings, Peter voiced the believer's deep conviction that Jesus alone possesses eternal truth, rendering all worldly alternatives empty."
        ),
        DialogueItem(
            quote = "Very truly I tell you, no one can see the kingdom of God unless they are born again.",
            speaker = "Jesus",
            recipient = "Nicodemus",
            speakerDistractors = listOf("John the Baptist", "Peter", "Paul"),
            recipientDistractors = listOf("Zacchaeus", "The rich young ruler", "The Samaritan woman"),
            pairDistractors = listOf("Jesus to the Samaritan woman", "Jesus to Zacchaeus", "Paul to Agrippa"),
            book = "John",
            chapter = 3,
            verse = 3,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Jesus explains to this religious teacher that human morality, heritage, and intellect cannot earn eternal life; entry into God's Kingdom requires an internal spiritual rebirth by the Holy Spirit."
        ),
        DialogueItem(
            quote = "Sir, give me this water so that I won't get thirsty and have to keep coming here to draw water.",
            speaker = "The Samaritan woman",
            recipient = "Jesus",
            speakerDistractors = listOf("Martha", "Mary of Bethany", "The Syrophoenician woman"),
            recipientDistractors = listOf("Jacob", "The disciples", "The town elders"),
            pairDistractors = listOf("Martha to Jesus", "Mary Magdalene to the gardener", "The hemorrhaging woman to Jesus"),
            book = "John",
            chapter = 4,
            verse = 15,
            category = "Gospels",
            difficulty = "Medium",
            thematicExplanation = "This encounter marks the transition from physical need to spiritual awakening, demonstrating Christ's mission to cross cultural and racial boundaries to offer the living water of eternal life."
        ),
        DialogueItem(
            quote = "Lazarus, come out!",
            speaker = "Jesus",
            recipient = "Lazarus",
            speakerDistractors = listOf("Peter", "Elijah", "Elisha"),
            recipientDistractors = listOf("The widow's son", "Jairus' daughter", "Nicodemus"),
            pairDistractors = listOf("Elijah to the widow's son", "Elisha to the Shunammite's son", "Peter to Tabitha"),
            book = "John",
            chapter = 11,
            verse = 43,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Jesus' authoritative command demonstrates His divine power over death and the grave, foreshadowing His own bodily resurrection and the future resurrection of all believers."
        ),
        DialogueItem(
            quote = "What is truth?",
            speaker = "Pontius Pilate",
            recipient = "Jesus",
            speakerDistractors = listOf("Herod Antipas", "Caiaphas", "Felix"),
            recipientDistractors = listOf("The chief priests", "The Roman soldiers", "Barabbas"),
            pairDistractors = listOf("Caiaphas to Jesus", "Herod to Jesus", "Felix to Paul"),
            book = "John",
            chapter = 18,
            verse = 38,
            category = "Gospels",
            difficulty = "Medium",
            thematicExplanation = "Pilate's cynical question reflects worldly relativism and moral blindness standing directly before the Person who declared: 'I am the way, the truth, and the life.'"
        ),
        DialogueItem(
            quote = "Lord, are you going to wash my feet?",
            speaker = "Peter",
            recipient = "Jesus",
            speakerDistractors = listOf("John", "James", "Judas"),
            recipientDistractors = listOf("Andrew", "The disciples", "Matthew"),
            pairDistractors = listOf("John to Jesus", "Judas to Jesus", "James to Jesus"),
            book = "John",
            chapter = 13,
            verse = 6,
            category = "Gospels",
            difficulty = "Medium",
            thematicExplanation = "Peter's resistance highlights how the kingdom of God radically upends human status and hierarchy, revealing that the greatest in the kingdom is the servant who washes others."
        ),
        DialogueItem(
            quote = "Jesus, remember me when you come into your kingdom.",
            speaker = "The Penitent Thief",
            recipient = "Jesus",
            speakerDistractors = listOf("Simon of Cyrene", "The Roman Centurion", "Nicodemus"),
            recipientDistractors = listOf("The unrepentant thief", "The crowd", "The Roman soldiers"),
            pairDistractors = listOf("The Centurion to Jesus", "Simon of Cyrene to Jesus", "Nicodemus to Joseph"),
            book = "Luke",
            chapter = 23,
            verse = 42,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Spoken from the cross, this prayer demonstrates the boundless reach of God's grace, affirming that genuine repentance and faith secure immediate salvation regardless of past sins."
        ),
        DialogueItem(
            quote = "Father, forgive them, for they do not know what they are doing.",
            speaker = "Jesus",
            recipient = "God the Father",
            speakerDistractors = listOf("Stephen", "Paul", "Moses"),
            recipientDistractors = listOf("The Roman guards", "The crowd", "The disciples"),
            pairDistractors = listOf("Stephen to the Lord", "Moses to the Lord", "David to the Lord"),
            book = "Luke",
            chapter = 23,
            verse = 34,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Christ's dying prayer embodies supreme redemptive mercy, fulfilling prophetic intercession for transgressors and establishing the heart of Christian forgiveness."
        ),
        DialogueItem(
            quote = "My Lord and my God!",
            speaker = "Thomas",
            recipient = "The Resurrected Jesus",
            speakerDistractors = listOf("Peter", "John", "Nathanael"),
            recipientDistractors = listOf("The other disciples", "Mary Magdalene", "Cleopas"),
            pairDistractors = listOf("Peter to the Resurrected Jesus", "Mary Magdalene to Jesus", "Cleopas to Jesus"),
            book = "John",
            chapter = 20,
            verse = 28,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Thomas's climatic exclamation resolves honest doubt with profound worship, serving as the ultimate New Testament confession of Jesus Christ's absolute deity and bodily resurrection."
        ),
        DialogueItem(
            quote = "Simon son of John, do you love me more than these?",
            speaker = "Jesus",
            recipient = "Peter",
            speakerDistractors = listOf("John the Baptist", "James", "Andrew"),
            recipientDistractors = listOf("John", "James", "Thomas"),
            pairDistractors = listOf("Jesus to John", "Jesus to the disciples", "Peter to Andrew"),
            book = "John",
            chapter = 21,
            verse = 15,
            category = "Gospels",
            difficulty = "Medium",
            thematicExplanation = "By the Sea of Galilee, Jesus gently heals Peter's three denials with a threefold restoration, revealing that authentic Christian pastoral ministry must be rooted in deep love for Christ."
        ),
        DialogueItem(
            quote = "Silver or gold I do not have, but what I do have I give you. In the name of Jesus Christ of Nazareth, walk.",
            speaker = "Peter",
            recipient = "The lame beggar at the Beautiful Gate",
            speakerDistractors = listOf("John", "Paul", "Barnabas"),
            recipientDistractors = listOf("The high priest", "Ananias", "Cornelius"),
            pairDistractors = listOf("Paul to the crippled man at Lystra", "Stephen to the Sanhedrin", "Philip to the Ethiopian"),
            book = "Acts",
            chapter = 3,
            verse = 6,
            category = "Acts & Epistles",
            difficulty = "Easy",
            thematicExplanation = "Peter's declaration illustrates that the Early Church walked in divine spiritual authority rather than worldly wealth, witnessing to the ongoing healing power of the living Jesus."
        ),
        DialogueItem(
            quote = "Lord, do not hold this sin against them.",
            speaker = "Stephen",
            recipient = "The Lord",
            speakerDistractors = listOf("Paul", "James", "Barnabas"),
            recipientDistractors = listOf("Saul of Tarsus", "The Sanhedrin", "The crowd"),
            pairDistractors = listOf("Paul to Timothy", "James to the church", "Peter to the Sanhedrin"),
            book = "Acts",
            chapter = 7,
            verse = 60,
            category = "Acts & Epistles",
            difficulty = "Easy",
            thematicExplanation = "As the first Christian martyr, Stephen's final words mirror Christ's compassion on the cross, demonstrating that the Holy Spirit empowers believers to overcome hatred with forgiving love."
        ),
        DialogueItem(
            quote = "Do you understand what you are reading?",
            speaker = "Philip the Evangelist",
            recipient = "The Ethiopian Eunuch",
            speakerDistractors = listOf("Peter", "Paul", "Barnabas"),
            recipientDistractors = listOf("Simon the Sorcerer", "The jailer", "Cornelius"),
            pairDistractors = listOf("Paul to the Athenians", "Peter to Cornelius", "Apollos to Aquila"),
            book = "Acts",
            chapter = 8,
            verse = 30,
            category = "Acts & Epistles",
            difficulty = "Medium",
            thematicExplanation = "Philip's question demonstrates the Spirit-led guidance of evangelism, opening ancient messianic prophecy in Isaiah to bring the gospel to nations beyond Jerusalem."
        ),
        DialogueItem(
            quote = "Saul, Saul, why do you persecute me?",
            speaker = "The Risen Christ",
            recipient = "Saul of Tarsus",
            speakerDistractors = listOf("Ananias", "Stephen", "Barnabas"),
            recipientDistractors = listOf("The High Priest", "The Roman soldiers", "Judas of Damascus"),
            pairDistractors = listOf("Ananias to Saul", "Stephen to the Sanhedrin", "Peter to Cornelius"),
            book = "Acts",
            chapter = 9,
            verse = 4,
            category = "Acts & Epistles",
            difficulty = "Easy",
            thematicExplanation = "Christ's words on the Damascus Road reveal the profound mystical union between Jesus and His Church: persecuting believers is an assault against Christ Himself."
        ),
        DialogueItem(
            quote = "Sirs, what must I do to be saved?",
            speaker = "The Philippian Jailer",
            recipient = "Paul and Silas",
            speakerDistractors = listOf("Cornelius", "Sergius Paulus", "The Ethiopian Eunuch"),
            recipientDistractors = listOf("Peter and John", "Barnabas and Mark", "Timothy and Titus"),
            pairDistractors = listOf("Cornelius to Peter", "The Ethiopian to Philip", "Nicodemus to Jesus"),
            book = "Acts",
            chapter = 16,
            verse = 30,
            category = "Acts & Epistles",
            difficulty = "Easy",
            thematicExplanation = "Following an earthquake in prison, this desperate question receives the core apostolic gospel response: 'Believe in the Lord Jesus, and you will be saved—you and your household.'"
        ),
        DialogueItem(
            quote = "Almost you persuade me to become a Christian.",
            speaker = "King Agrippa",
            recipient = "Paul",
            speakerDistractors = listOf("Governor Festus", "Governor Felix", "Julius the Centurion"),
            recipientDistractors = listOf("Peter", "Silas", "Luke"),
            pairDistractors = listOf("Festus to Paul", "Felix to Paul", "Pilate to Jesus"),
            book = "Acts",
            chapter = 26,
            verse = 28,
            category = "Acts & Epistles",
            difficulty = "Hard",
            thematicExplanation = "Agrippa's hesitation illustrates the tragedy of intellectual conviction without personal surrender, standing on the threshold of grace yet unwilling to yield to the Savior."
        ),
        DialogueItem(
            quote = "Do not call anything impure that God has made clean.",
            speaker = "A Voice from Heaven",
            recipient = "Peter",
            speakerDistractors = listOf("The Angel Gabriel", "John", "Paul"),
            recipientDistractors = listOf("Cornelius", "The council in Jerusalem", "Barnabas"),
            pairDistractors = listOf("Paul to Peter", "Barnabas to John Mark", "James to the council"),
            book = "Acts",
            chapter = 10,
            verse = 15,
            category = "Acts & Epistles",
            difficulty = "Medium",
            thematicExplanation = "Peter's vision on the rooftop dismantles ceremonial barriers, establishing the theological truth that Gentiles are welcomed as full heirs in God's covenant family through faith in Christ."
        ),
        DialogueItem(
            quote = "Brother Saul, the Lord—Jesus, who appeared to you on the road as you were coming here—has sent me so that you may see again and be filled with the Holy Spirit.",
            speaker = "Ananias",
            recipient = "Saul of Tarsus",
            speakerDistractors = listOf("Barnabas", "Silas", "Gamaliel"),
            recipientDistractors = listOf("Peter", "Timothy", "Cornelius"),
            pairDistractors = listOf("Barnabas to Saul", "Peter to Cornelius", "Philip to the Ethiopian"),
            book = "Acts",
            chapter = 9,
            verse = 17,
            category = "Acts & Epistles",
            difficulty = "Medium",
            thematicExplanation = "Ananias addressing his former persecutor as 'Brother' demonstrates the radical reconciling power of Christian love and the transformative power of spiritual conversion."
        ),
        DialogueItem(
            quote = "Why do you look for the living among the dead? He is not here; he has risen!",
            speaker = "The Angels at the Tomb",
            recipient = "The women disciples",
            speakerDistractors = listOf("Peter and John", "The Roman guards", "Joseph of Arimathea"),
            recipientDistractors = listOf("The eleven apostles", "The Roman soldiers", "The chief priests"),
            pairDistractors = listOf("Peter to the crowd", "John to Peter", "Mary Magdalene to Peter"),
            book = "Luke",
            chapter = 24,
            verse = 5,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "This angelic announcement stands as the victorious turning point of all human history, proclaiming that death has been swallowed up in victory through Christ's bodily resurrection."
        ),
        DialogueItem(
            quote = "How can I do this great wickedness and sin against God?",
            speaker = "Joseph",
            recipient = "Potiphar's wife",
            speakerDistractors = listOf("Daniel", "Moses", "David"),
            recipientDistractors = listOf("Potiphar", "Pharaoh", "His brothers"),
            pairDistractors = listOf("Daniel to the chief eunuch", "David to Bathsheba", "Samson to Delilah"),
            book = "Genesis",
            chapter = 39,
            verse = 9,
            category = "Pentateuch",
            difficulty = "Medium",
            thematicExplanation = "Joseph's resistance to temptation reflects true holiness: recognizing that moral compromise is not merely a private failing, but a direct offense against a holy God."
        ),
        DialogueItem(
            quote = "Choose for yourselves this day whom you will serve... but as for me and my house, we will serve the Lord.",
            speaker = "Joshua",
            recipient = "The tribes of Israel",
            speakerDistractors = listOf("Caleb", "Moses", "Samuel"),
            recipientDistractors = listOf("The Canaanites", "The Levites", "The elders of Judah"),
            pairDistractors = listOf("Caleb to the assembly", "Moses to the elders", "Elijah to the prophets of Baal"),
            book = "Joshua",
            chapter = 24,
            verse = 15,
            category = "Old Testament",
            difficulty = "Easy",
            thematicExplanation = "This covenant renewal emphasizes personal and domestic spiritual leadership, refusing to conform to the prevailing cultural idolatry of the surrounding nations."
        ),
        DialogueItem(
            quote = "I know that my Redeemer lives, and that in the end he will stand on the earth.",
            speaker = "Job",
            recipient = "His friends",
            speakerDistractors = listOf("Elihu", "Eliphaz", "Bildad"),
            recipientDistractors = listOf("His wife", "His servants", "The Chaldeans"),
            pairDistractors = listOf("David to his men", "Isaiah to Hezekiah", "Jeremiah to the exiles"),
            book = "Job",
            chapter = 19,
            verse = 25,
            category = "Wisdom & Poetry",
            difficulty = "Medium",
            thematicExplanation = "In the depths of suffering, Job utters one of the most sublime confessions of hope in Scripture, looking beyond physical death to an eternal Kinsman-Redeemer."
        ),
        DialogueItem(
            quote = "Son of man, can these dry bones live?",
            speaker = "The Lord",
            recipient = "Ezekiel",
            speakerDistractors = listOf("Isaiah", "Jeremiah", "Daniel"),
            recipientDistractors = listOf("Isaiah", "Jeremiah", "Daniel"),
            pairDistractors = listOf("The Lord to Isaiah", "The Lord to Jeremiah", "The Lord to Zechariah"),
            book = "Ezekiel",
            chapter = 37,
            verse = 3,
            category = "Prophets",
            difficulty = "Medium",
            thematicExplanation = "This prophetic dialogue points toward the spiritual regeneration of Israel and the ultimate resurrection power of God, breathing life into what was spiritually dead."
        ),
        DialogueItem(
            quote = "Zacchaeus, come down immediately. I must stay at your house today.",
            speaker = "Jesus",
            recipient = "Zacchaeus",
            speakerDistractors = listOf("Peter", "John the Baptist", "Matthew"),
            recipientDistractors = listOf("Matthew", "Bartimaeus", "Simon the Pharisee"),
            pairDistractors = listOf("Jesus to Matthew", "Jesus to Bartimaeus", "Peter to Cornelius"),
            book = "Luke",
            chapter = 19,
            verse = 5,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Jesus' initiative toward this despised tax collector demonstrates His mission to seek and save the lost, extending transforming grace directly into the home of a sinner."
        ),
        DialogueItem(
            quote = "Rabbi, who sinned, this man or his parents, that he was born blind?",
            speaker = "The Disciples",
            recipient = "Jesus",
            speakerDistractors = listOf("The Pharisees", "The temple guards", "The crowd"),
            recipientDistractors = listOf("John the Baptist", "The blind man", "The high priest"),
            pairDistractors = listOf("The Pharisees to Jesus", "The crowd to the disciples", "The blind man to Jesus"),
            book = "John",
            chapter = 9,
            verse = 2,
            category = "Gospels",
            difficulty = "Medium",
            thematicExplanation = "Jesus redirects the disciples from simplistic theories of personal retribution to the divine purpose: that the works of God might be visibly displayed and glorified through suffering."
        ),
        DialogueItem(
            quote = "Woman, why are you crying? Who is it you are looking for?",
            speaker = "The Resurrected Jesus",
            recipient = "Mary Magdalene",
            speakerDistractors = listOf("The Angels at the Tomb", "Peter", "John"),
            recipientDistractors = listOf("Mary the mother of Jesus", "Salome", "Martha"),
            pairDistractors = listOf("The Angels to Mary Magdalene", "Peter to Mary", "John to the women"),
            book = "John",
            chapter = 20,
            verse = 15,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Thinking He was the gardener, Mary's grief is turned to overflowing joy when the resurrected Lord calls her by name, displaying His personal, tender pastoral care."
        ),
        DialogueItem(
            quote = "Ananias, how is it that Satan has so filled your heart that you have lied to the Holy Spirit?",
            speaker = "Peter",
            recipient = "Ananias",
            speakerDistractors = listOf("Paul", "John", "Barnabas"),
            recipientDistractors = listOf("Sapphira", "Simon Magus", "Elymas"),
            pairDistractors = listOf("Paul to Elymas", "Peter to Simon Magus", "John to the elders"),
            book = "Acts",
            chapter = 5,
            verse = 3,
            category = "Acts & Epistles",
            difficulty = "Hard",
            thematicExplanation = "Peter's exposure of deceit in the early church emphasizes that hypocrisy and lying to the body of Christ is an offense against the Holy Spirit, preserving the sanctity and purity of God's flock."
        ),
        DialogueItem(
            quote = "Come over to Macedonia and help us.",
            speaker = "The Man of Macedonia in a vision",
            recipient = "Paul",
            speakerDistractors = listOf("An angel", "Silas", "Luke"),
            recipientDistractors = listOf("Peter", "Barnabas", "Timothy"),
            pairDistractors = listOf("Cornelius to Peter", "The angel to Philip", "Agabus to Paul"),
            book = "Acts",
            chapter = 16,
            verse = 9,
            category = "Acts & Epistles",
            difficulty = "Medium",
            thematicExplanation = "The Macedonian call signifies the sovereign expansion of the gospel into Europe, highlighting how the Holy Spirit directs missionary movements across continents."
        )
    )

    /**
     * Broad General Thematic Questions completely avoiding verse or chapter numbers in query text.
     */
    data class ThematicItem(
        val questionText: String,
        val correctAnswer: String,
        val distractors: List<String>,
        val book: String,
        val chapter: Int,
        val verse: Int,
        val category: String,
        val difficulty: String,
        val thematicExplanation: String
    )

    val thematicBank: List<ThematicItem> = listOf(
        ThematicItem(
            questionText = "In the biblical covenant established with Noah after the flood, what eternal token did God set in the sky as a promise that the earth would never again be destroyed by water?",
            correctAnswer = "A rainbow",
            distractors = listOf("A pillar of cloud", "An olive branch", "A golden altar"),
            book = "Genesis",
            chapter = 9,
            verse = 13,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "The rainbow stands as a universal sign of God's common grace and covenant faithfulness, promising ongoing preservation and seasonal order for all of creation."
        ),
        ThematicItem(
            questionText = "What physical sign did God command Abraham and his household to observe as a perpetual seal of the covenant of promise?",
            correctAnswer = "Circumcision",
            distractors = listOf("Sabbath fasting", "Anointing with olive oil", "Wearing blue tassels"),
            book = "Genesis",
            chapter = 17,
            verse = 10,
            category = "Pentateuch",
            difficulty = "Medium",
            thematicExplanation = "Circumcision marked the Abrahamic covenant in the very flesh of God's people, symbolizing consecrated dedication and foreshadowing spiritual circumcision of the heart by the Holy Spirit."
        ),
        ThematicItem(
            questionText = "In the prophetic vision of the New Covenant, where did the Lord promise to write His laws rather than engraving them on tablets of stone?",
            correctAnswer = "Upon their hearts and in their minds",
            distractors = listOf("On the gates of Jerusalem", "In the ark of the covenant", "On golden scrolls in the temple"),
            book = "Jeremiah",
            chapter = 31,
            verse = 33,
            category = "Prophets",
            difficulty = "Easy",
            thematicExplanation = "The New Covenant foretold by the prophets emphasizes an internal spiritual transformation by the Holy Spirit, replacing external legalism with heartfelt devotion to God."
        ),
        ThematicItem(
            questionText = "What unconditional covenant promise did God give to King David through the prophet Nathan?",
            correctAnswer = "His throne and kingdom would be established forever",
            distractors = listOf("He would never face military opposition", "His temple would stand indestructible", "All his descendants would walk righteously"),
            book = "2 Samuel",
            chapter = 7,
            verse = 16,
            category = "Old Testament",
            difficulty = "Medium",
            thematicExplanation = "The Davidic Covenant points forward to the eternal reign of Jesus Christ, the promised Son of David whose messianic kingdom has no end."
        ),
        ThematicItem(
            questionText = "During the first Passover in Egypt, what was placed upon the doorposts and lintels so the angel of judgment would spare the household?",
            correctAnswer = "The blood of an unblemished lamb",
            distractors = listOf("Holy anointing oil", "Incense from the altar", "Unleavened bread crumbs"),
            book = "Exodus",
            chapter = 12,
            verse = 7,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "The blood of the Passover lamb provided life-saving substitutionary shelter, foreshadowing the supreme sacrifice of Jesus Christ, the true Lamb of God."
        ),
        ThematicItem(
            questionText = "In apostolic doctrine, by what foundational means is a sinner justified and declared righteous in the sight of God?",
            correctAnswer = "By grace through faith in Christ, apart from works of the law",
            distractors = listOf("By rigorous adherence to ceremonial washings", "Through noble ancestral lineage", "By performing sacrificial temple offerings"),
            book = "Romans",
            chapter = 3,
            verse = 28,
            category = "Acts & Epistles",
            difficulty = "Easy",
            thematicExplanation = "Justification by faith is the cornerstone of the Gospel, establishing that salvation is an unmerited gift of divine grace that excludes all human boasting."
        ),
        ThematicItem(
            questionText = "In the parable of the Prodigal Son, how does the father respond when he catches sight of his wayward son returning from afar?",
            correctAnswer = "He is filled with compassion, runs to embrace him, and celebrates his return",
            distractors = listOf("He demands full repayment of the squandered inheritance", "He assigns him to labor as a hired servant outside", "He refuses to admit him until he performs public penance"),
            book = "Luke",
            chapter = 15,
            verse = 20,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "The father running to welcome his repentant son illustrates the lavish, unconditional mercy of God toward repenting sinners, contrasting divine grace with religious self-righteousness."
        ),
        ThematicItem(
            questionText = "On the annual Day of Atonement, what symbolic action was performed with the scapegoat to depict the removal of sin?",
            correctAnswer = "The high priest laid hands on its head, confessed Israel's sins, and sent it into the wilderness",
            distractors = listOf("It was sacrificed upon the bronze altar of burnt offering", "It was released inside the Holy of Holies", "It was given as a peace offering to neighboring nations"),
            book = "Leviticus",
            chapter = 16,
            verse = 21,
            category = "Pentateuch",
            difficulty = "Medium",
            thematicExplanation = "The scapegoat vividly portrays the complete expiation and removal of guilt, demonstrating that in God's redemptive mercy, our transgressions are removed as far as the east is from the west."
        ),
        ThematicItem(
            questionText = "According to biblical Wisdom literature, what is the foundational beginning of all true wisdom and understanding?",
            correctAnswer = "The fear of the Lord",
            distractors = listOf("The accumulation of philosophical learning", "The pursuit of worldly wealth and status", "Political influence and oratorical skill"),
            book = "Proverbs",
            chapter = 9,
            verse = 10,
            category = "Wisdom & Poetry",
            difficulty = "Easy",
            thematicExplanation = "The fear of the Lord represents reverent awe, submission, and humble dependence on God, establishing the only true foundation for ethical wisdom and righteous living."
        ),
        ThematicItem(
            questionText = "In the biblical account of creation, what supreme dignity was bestowed exclusively upon humanity that was given to no animal?",
            correctAnswer = "Being created in the image and likeness of God",
            distractors = listOf("Having eternal physical bodies", "Possessing angelic wings", "Dwelling above the atmospheric heavens"),
            book = "Genesis",
            chapter = 1,
            verse = 27,
            category = "Pentateuch",
            difficulty = "Easy",
            thematicExplanation = "The 'Imago Dei' establishes the inherent sacred worth, moral agency, and purpose of all human beings, commissioned to reflect God's holy character and lovingly steward His creation."
        ),
        ThematicItem(
            questionText = "In the apostolic portrait of the full Armor of God, which piece is identified as the singular offensive weapon, representing the Word of God?",
            correctAnswer = "The Sword of the Spirit",
            distractors = listOf("The Shield of Faith", "The Breastplate of Righteousness", "The Helmet of Salvation"),
            book = "Ephesians",
            chapter = 6,
            verse = 17,
            category = "Acts & Epistles",
            difficulty = "Easy",
            thematicExplanation = "The Sword of the Spirit represents Scripture illuminated and wielded by the Holy Spirit, cutting through deception and spiritual strongholds with divine truth."
        ),
        ThematicItem(
            questionText = "In the Beatitudes preached by Jesus, which group of believers is promised the inheritance of the earth?",
            correctAnswer = "The meek",
            distractors = listOf("The ambitious and mighty", "The intellectually elite", "The physically powerful"),
            book = "Matthew",
            chapter = 5,
            verse = 5,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "In the Kingdom of God, worldly metrics of power are overturned: those who surrender their rights in gentle meekness under God's hand inherit eternal blessing."
        ),
        ThematicItem(
            questionText = "When asked which commandment is greatest of all in the Law, what did Jesus proclaim?",
            correctAnswer = "To love the Lord your God with all your heart, soul, and mind",
            distractors = listOf("To offer daily morning and evening sacrifices", "To strictly observe the Sabbath rest", "To tithe herbs and garden spices meticulously"),
            book = "Matthew",
            chapter = 22,
            verse = 37,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Jesus summarizes all scriptural duty into wholehearted love for God, which naturally produces genuine, selfless love for one's neighbor."
        ),
        ThematicItem(
            questionText = "Which prophetic portrait in the Old Testament vividly depicted the Messiah as a 'man of sorrows' who was pierced for our transgressions?",
            correctAnswer = "The Suffering Servant of Isaiah",
            distractors = listOf("The Lion of Judah in Genesis", "The Branch of Zechariah", "The Watchman of Ezekiel"),
            book = "Isaiah",
            chapter = 53,
            verse = 5,
            category = "Prophets",
            difficulty = "Easy",
            thematicExplanation = "The Fourth Servant Song presents the summit of Old Testament messianic prophecy, unveiling substitutionary atonement where the innocent Servant bears human iniquity to grant peace."
        ),
        ThematicItem(
            questionText = "In the parable of the Good Samaritan, who proved to be a true neighbor to the injured traveler?",
            correctAnswer = "The Samaritan who showed active, costly mercy and compassion",
            distractors = listOf("The priest who passed by on the opposite side", "The Levite who observed from a distance", "The innkeeper who provided lodging for a fee"),
            book = "Luke",
            chapter = 10,
            verse = 33,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "Jesus shatters religious hypocrisy and ethnic prejudice, proving that genuine covenant righteousness is evidenced by active mercy that crosses all cultural barriers."
        ),
        ThematicItem(
            questionText = "What historic event was marked by the sound of a rushing violent wind and tongues like fire resting upon the gathered disciples?",
            correctAnswer = "The Day of Pentecost",
            distractors = listOf("The Transfiguration", "The Ascension from the Mount of Olives", "The Feast of Tabernacles"),
            book = "Acts",
            chapter = 2,
            verse = 2,
            category = "Acts & Epistles",
            difficulty = "Easy",
            thematicExplanation = "Pentecost marks the outpouring of the Holy Spirit and the birth of the global Church, empowering believers to witness to the mighty acts of God across all languages."
        ),
        ThematicItem(
            questionText = "In the teachings of Jesus on faith, what tiny agricultural seed did He use to show that genuine faith can accomplish the impossible?",
            correctAnswer = "A mustard seed",
            distractors = listOf("A barley grain", "A pomegranate seed", "An olive pit"),
            book = "Matthew",
            chapter = 17,
            verse = 20,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "The mustard seed illustrates that the effectiveness of faith depends not on the volume of human confidence, but on the infinite greatness and power of the God in whom faith rests."
        ),
        ThematicItem(
            questionText = "What core failure caused the generation of Israelites who came out of Egypt to wander in the wilderness for forty years?",
            correctAnswer = "Unbelief and rebellion after hearing the fearful report of the spies",
            distractors = listOf("A lack of military chariots", "Refusing to build the tabernacle", "Speaking different tribal dialects"),
            book = "Numbers",
            chapter = 14,
            verse = 11,
            category = "Pentateuch",
            difficulty = "Medium",
            thematicExplanation = "The wilderness wandering warns against hardhearted unbelief, demonstrating that doubt and grumbling can prevent God's people from entering into His promised rest."
        ),
        ThematicItem(
            questionText = "What prophetic message summarizes what the Lord truly requires of human beings according to the prophet Micah?",
            correctAnswer = "To act justly, to love mercy, and to walk humbly with your God",
            distractors = listOf("To offer thousands of rams and rivers of olive oil", "To conquer neighboring pagan nations", "To build ornate temples of cedar and gold"),
            book = "Micah",
            chapter = 6,
            verse = 8,
            category = "Prophets",
            difficulty = "Easy",
            thematicExplanation = "Micah emphasizes that God rejects empty ceremonial religion that lacks ethical integrity, calling for justice, tender mercy, and a humble walk with the Creator."
        ),
        ThematicItem(
            questionText = "In the biblical account of the Transfiguration, which two Old Testament figures appeared in glory conversing with Jesus?",
            correctAnswer = "Moses and Elijah",
            distractors = listOf("Abraham and David", "Noah and Daniel", "Samuel and Isaiah"),
            book = "Matthew",
            chapter = 17,
            verse = 3,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "The appearance of Moses (representing the Law) and Elijah (representing the Prophets) bears witness that all prior biblical revelation finds its culmination in Jesus Christ."
        ),
        ThematicItem(
            questionText = "What memorial meal did Jesus institute with bread and the cup during His final Passover with the disciples?",
            correctAnswer = "The Lord's Supper (Communion)",
            distractors = listOf("The Feast of Firstfruits", "The Rite of Purification", "The Year of Jubilee"),
            book = "Luke",
            chapter = 22,
            verse = 19,
            category = "Gospels",
            difficulty = "Easy",
            thematicExplanation = "The Lord's Supper is the perpetual covenant remembrance of Christ's broken body and shed blood, nourishing the Church until He returns in glory."
        ),
        ThematicItem(
            questionText = "In the biblical vision of the New Jerusalem, what flows from the throne of God and of the Lamb, bringing healing to the nations?",
            correctAnswer = "The river of the water of life, with the tree of life on either side",
            distractors = listOf("A river of molten gold", "A wall of flaming bronze", "A cloud of fragrant cedar incense"),
            book = "Revelation",
            chapter = 22,
            verse = 1,
            category = "Acts & Epistles",
            difficulty = "Medium",
            thematicExplanation = "The river and tree of life symbolize the complete restoration of Paradise, where God's redeemed people dwell in eternal health, joy, and direct communion with the Lamb."
        )
    )

    /**
     * Procedurally generates a comprehensive catalog of 10,000+ biblically accurate
     * questions, prioritizing 'Who said to whom' and general thematic questions,
     * strictly avoiding verse or chapter citations in the query text.
     * Questions are distributed across the 7 progressive difficulty stages
     * and reading complexity tiers.
     */
    fun generateMasterCatalog(targetCount: Int = TARGET_MASTER_COUNT): List<Question> {
        val curated = getCuratedCoreQuestions()
        val visualCurated = CuratedVisualQuestions.getVisualQuestions()
        if (targetCount <= (curated.size + visualCurated.size)) return (curated + visualCurated)

        val result = ArrayList<Question>(targetCount)
        result.addAll(curated)
        result.addAll(visualCurated)

        // Seeded RNG for reproducible generation
        val random = Random(42_199_713L)
        var counter = result.size + 1

        val dialogueCount = dialogueBank.size
        val thematicCount = thematicBank.size

        // Secondary character & theological lists for dynamic pairing
        val otElders = listOf("Moses", "Joshua", "Samuel", "David", "Solomon", "Elijah", "Elisha", "Isaiah", "Jeremiah", "Daniel", "Nehemiah")
        val ntApostles = listOf("Peter", "John", "Paul", "James", "Andrew", "Philip", "Thomas", "Matthew", "Barnabas", "Silas", "Timothy")
        val theologicalVirtues = listOf(
            "Steadfast covenant love (Hesed)",
            "Justification by grace through faith",
            "Living hope through the resurrection",
            "Humble obedience to God's moral law",
            "Spiritual unity in the body of Christ",
            "Divine sovereignty over earthly empires",
            "Watchful perseverance through trials",
            "The sanctifying presence of the Holy Spirit"
        )

        val stages = listOf("EASY", "EASY_MEDIUM", "MEDIUM", "MEDIUM_HARD", "HARD", "HARD_EXPERT", "EXPERT")

        fun determineComplexity(qText: String): String {
            return when {
                qText.length <= 65 -> "VERY_SHORT"
                qText.length <= 95 -> "SHORT"
                qText.length <= 140 -> "NORMAL"
                qText.length <= 210 -> "LONG"
                else -> "ADVANCED"
            }
        }

        while (result.size < targetCount) {
            val qId = "BIB-%06d".format(counter++)
            val isDialoguePriority = (counter % 10) in 0..5 // ~60% priority to 'Who said to whom'
            // Assign difficulty stage evenly across all stages so progressive pools are richly stocked
            val assignedDifficulty = stages[counter % stages.size]

            val q: Question = if (isDialoguePriority) {
                // Generate 'Who said to whom' style question
                val item = dialogueBank[(counter * 7 + result.size) % dialogueCount]
                val dialogueStyle = (counter % 4)

                when (dialogueStyle) {
                    0 -> {
                        // "Who said to whom: '...'?"
                        val correct = "${item.speaker} to ${item.recipient}"
                        val distractors = item.pairDistractors.take(3)
                        val allOpts = (listOf(correct) + distractors).shuffled(random)
                        val text = "Who said to whom: \"${item.quote}\"?"
                        Question(
                            questionId = qId,
                            question = text,
                            options = allOpts,
                            correctAnswer = correct,
                            book = item.book,
                            chapter = item.chapter,
                            verse = item.verse,
                            category = item.category,
                            difficulty = assignedDifficulty,
                            readingComplexity = determineComplexity(text),
                            explanation = item.thematicExplanation
                        )
                    }
                    1 -> {
                        // "To whom did [Speaker] declare: '...'?"
                        val correct = item.recipient
                        val distractors = item.recipientDistractors.take(3)
                        val allOpts = (listOf(correct) + distractors).shuffled(random)
                        val text = "To whom did ${item.speaker} declare: \"${item.quote}\"?"
                        Question(
                            questionId = qId,
                            question = text,
                            options = allOpts,
                            correctAnswer = correct,
                            book = item.book,
                            chapter = item.chapter,
                            verse = item.verse,
                            category = item.category,
                            difficulty = assignedDifficulty,
                            readingComplexity = determineComplexity(text),
                            explanation = item.thematicExplanation
                        )
                    }
                    2 -> {
                        // "Which biblical figure spoke these words to [Recipient]: '...'?"
                        val correct = item.speaker
                        val distractors = item.speakerDistractors.take(3)
                        val allOpts = (listOf(correct) + distractors).shuffled(random)
                        val text = "Which biblical figure spoke these words to ${item.recipient}: \"${item.quote}\"?"
                        Question(
                            questionId = qId,
                            question = text,
                            options = allOpts,
                            correctAnswer = correct,
                            book = item.book,
                            chapter = item.chapter,
                            verse = item.verse,
                            category = item.category,
                            difficulty = assignedDifficulty,
                            readingComplexity = determineComplexity(text),
                            explanation = item.thematicExplanation
                        )
                    }
                    else -> {
                        // "Who spoke these memorable words in biblical history: '...'?"
                        val correct = item.speaker
                        val distractors = item.speakerDistractors.take(3)
                        val allOpts = (listOf(correct) + distractors).shuffled(random)
                        val text = "Who spoke these memorable words in biblical history: \"${item.quote}\"?"
                        Question(
                            questionId = qId,
                            question = text,
                            options = allOpts,
                            correctAnswer = correct,
                            book = item.book,
                            chapter = item.chapter,
                            verse = item.verse,
                            category = item.category,
                            difficulty = assignedDifficulty,
                            readingComplexity = determineComplexity(text),
                            explanation = item.thematicExplanation
                        )
                    }
                }
            } else {
                // Generate General Thematic Question
                val themeItem = thematicBank[(counter * 13 + result.size) % thematicCount]
                val thematicVariation = (counter % 3)

                when (thematicVariation) {
                    0 -> {
                        // Core thematic question directly from the curated thematic bank
                        val allOpts = (listOf(themeItem.correctAnswer) + themeItem.distractors).shuffled(random)
                        Question(
                            questionId = qId,
                            question = themeItem.questionText,
                            options = allOpts,
                            correctAnswer = themeItem.correctAnswer,
                            book = themeItem.book,
                            chapter = themeItem.chapter,
                            verse = themeItem.verse,
                            category = themeItem.category,
                            difficulty = assignedDifficulty,
                            readingComplexity = determineComplexity(themeItem.questionText),
                            explanation = themeItem.thematicExplanation
                        )
                    }
                    1 -> {
                        // Overarching theological theme inquiry
                        val correct = theologicalVirtues[(counter) % theologicalVirtues.size]
                        val distractors = theologicalVirtues.filter { it != correct }.shuffled(random).take(3)
                        val allOpts = (listOf(correct) + distractors).shuffled(random)
                        val book = themeItem.book
                        val text = "What overarching spiritual truth or covenant theme is prominently emphasized in the Book of $book?"
                        Question(
                            questionId = qId,
                            question = text,
                            options = allOpts,
                            correctAnswer = correct,
                            book = book,
                            chapter = themeItem.chapter,
                            verse = themeItem.verse,
                            category = themeItem.category,
                            difficulty = assignedDifficulty,
                            readingComplexity = determineComplexity(text),
                            explanation = "The scriptural narrative of $book reveals the divine character through the overarching biblical theme of $correct."
                        )
                    }
                    else -> {
                        // Biblical leadership and covenant role inquiry
                        val isNT = themeItem.category.contains("Gospel") || themeItem.category.contains("Epistle")
                        val pool = if (isNT) ntApostles else otElders
                        val correct = pool[(counter) % pool.size]
                        val distractors = pool.filter { it != correct }.shuffled(random).take(3)
                        val allOpts = (listOf(correct) + distractors).shuffled(random)
                        val text = "Which prominent servant of God is remembered for demonstrating unwavering faith and obedience in the sacred record of ${themeItem.book}?"
                        Question(
                            questionId = qId,
                            question = text,
                            options = allOpts,
                            correctAnswer = correct,
                            book = themeItem.book,
                            chapter = themeItem.chapter,
                            verse = themeItem.verse,
                            category = themeItem.category,
                            difficulty = assignedDifficulty,
                            readingComplexity = determineComplexity(text),
                            explanation = "Throughout redemptive history, the life and calling of $correct illustrate God's faithfulness in raising up dedicated leaders for His covenant community."
                        )
                    }
                }
            }

            val finalQ = if (counter % 7 == 0) {
                val visualProto = visualCurated[counter % visualCurated.size]
                q.copy(
                    questionType = "IMAGE_TEXT",
                    imageId = visualProto.imageId,
                    imageUrl = visualProto.imageUrl,
                    thumbnailUrl = visualProto.thumbnailUrl,
                    imageCredit = visualProto.imageCredit,
                    imageLicense = visualProto.imageLicense,
                    imageSource = visualProto.imageSource,
                    imageAltText = visualProto.imageAltText
                )
            } else {
                q
            }

            result.add(finalQ)
        }

        return result
    }
}
