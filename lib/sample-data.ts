import type {
  ReadingExercise,
  ListeningExercise,
  SpeakingPrompt,
  WritingPrompt,
} from "@/types";

export const sampleReadingExercises: ReadingExercise[] = [
  {
    id: "r1",
    title: "La vie quotidienne à Montréal",
    level: "A2",
    topic: "Vie urbaine",
    time_limit: 600,
    created_at: new Date().toISOString(),
    text: `Montréal est une grande ville du Québec, au Canada. C'est une ville bilingue où les gens parlent français et anglais. Environ 4 millions de personnes habitent dans la région de Montréal.

La ville est connue pour ses festivals, notamment le Festival International de Jazz de Montréal qui attire des musiciens du monde entier chaque été. Les Montréalais aiment aussi le Festival Juste pour Rire, un festival de comédie très populaire.

Dans les quartiers de Montréal, on trouve beaucoup de restaurants, de cafés et de boutiques. Le Vieux-Montréal est un quartier historique avec des bâtiments anciens et des rues pavées. C'est un endroit très touristique.

Les transports en commun à Montréal sont bien développés. Le métro, les autobus et les pistes cyclables permettent aux habitants de se déplacer facilement dans la ville. Beaucoup de Montréalais utilisent le vélo, surtout en été.`,
    questions: [
      {
        id: "q1",
        question: "Combien de personnes habitent dans la région de Montréal ?",
        options: [
          "Environ 1 million",
          "Environ 2 millions",
          "Environ 4 millions",
          "Environ 6 millions",
        ],
        correct_answer: 2,
        explanation:
          "Le texte dit 'Environ 4 millions de personnes habitent dans la région de Montréal.'",
      },
      {
        id: "q2",
        question: "Qu'est-ce que le Festival Juste pour Rire ?",
        options: [
          "Un festival de musique",
          "Un festival de comédie",
          "Un festival de cinéma",
          "Un festival de danse",
        ],
        correct_answer: 1,
        explanation:
          "Le texte mentionne que c'est 'un festival de comédie très populaire'.",
      },
      {
        id: "q3",
        question: "Comment se caractérise le Vieux-Montréal ?",
        options: [
          "C'est un quartier moderne avec des gratte-ciels",
          "C'est un quartier résidentiel calme",
          "C'est un quartier historique avec des bâtiments anciens",
          "C'est un quartier industriel",
        ],
        correct_answer: 2,
        explanation:
          "Le texte décrit le Vieux-Montréal comme 'un quartier historique avec des bâtiments anciens et des rues pavées'.",
      },
      {
        id: "q4",
        question:
          "Quel moyen de transport les Montréalais utilisent-ils beaucoup en été ?",
        options: ["La voiture", "Le train", "Le vélo", "Le taxi"],
        correct_answer: 2,
        explanation:
          "Le texte précise 'Beaucoup de Montréalais utilisent le vélo, surtout en été.'",
      },
    ],
  },
  {
    id: "r2",
    title: "L'immigration au Québec",
    level: "B1",
    topic: "Immigration et société",
    time_limit: 900,
    created_at: new Date().toISOString(),
    text: `Le Québec accueille chaque année des milliers d'immigrants venus du monde entier. Ces nouveaux arrivants s'installent au Québec pour diverses raisons : rejoindre leur famille, trouver un emploi, fuir des situations difficiles dans leur pays d'origine, ou encore profiter d'une meilleure qualité de vie.

Le gouvernement québécois met en place différents programmes pour faciliter l'intégration des immigrants. Ces programmes comprennent des cours de français gratuits, des séances d'information sur la société québécoise, et des services d'aide à la recherche d'emploi. La maîtrise du français est considérée comme essentielle pour réussir son intégration au Québec.

La culture québécoise est le résultat d'un mélange de différentes influences. L'héritage franco-canadien coexiste avec les apports des communautés autochtones, des immigrants anglophones et des nombreuses vagues d'immigration qui ont façonné la province au fil des siècles.

Malgré les efforts d'intégration, certains immigrants font face à des défis. La reconnaissance des diplômes étrangers, la discrimination dans le milieu du travail et le choc culturel peuvent représenter des obstacles importants. Des organismes communautaires travaillent activement pour aider les nouveaux arrivants à surmonter ces difficultés.`,
    questions: [
      {
        id: "q1",
        question:
          "Pourquoi les immigrants choisissent-ils de s'installer au Québec ? (Plusieurs raisons sont mentionnées)",
        options: [
          "Uniquement pour des raisons économiques",
          "Pour diverses raisons incluant la famille, l'emploi et la qualité de vie",
          "Seulement pour fuir des situations difficiles",
          "Principalement pour apprendre le français",
        ],
        correct_answer: 1,
        explanation:
          "Le texte mentionne plusieurs raisons : rejoindre la famille, trouver un emploi, fuir des situations difficiles, et profiter d'une meilleure qualité de vie.",
      },
      {
        id: "q2",
        question:
          "Qu'est-ce que le gouvernement québécois fait pour aider les immigrants ?",
        options: [
          "Il leur offre des maisons gratuites",
          "Il propose des cours de français et des services d'emploi",
          "Il leur donne de l'argent pendant 5 ans",
          "Il leur accorde la citoyenneté immédiatement",
        ],
        correct_answer: 1,
        explanation:
          "Le texte mentionne des cours de français gratuits, des séances d'information et des services d'aide à la recherche d'emploi.",
      },
      {
        id: "q3",
        question:
          "Quel est le principal défi mentionné pour les immigrants dans le milieu du travail ?",
        options: [
          "Ne pas parler anglais",
          "La discrimination",
          "Manque de transports",
          "Coût de la vie trop élevé",
        ],
        correct_answer: 1,
        explanation:
          "Le texte cite 'la discrimination dans le milieu du travail' comme obstacle important.",
      },
      {
        id: "q4",
        question:
          "Comment est décrite la culture québécoise dans le texte ?",
        options: [
          "Comme une culture purement française",
          "Comme le résultat d'un mélange de différentes influences",
          "Comme une culture principalement autochtone",
          "Comme une culture exclusivement anglophone",
        ],
        correct_answer: 1,
        explanation:
          "Le texte dit que 'La culture québécoise est le résultat d'un mélange de différentes influences'.",
      },
    ],
  },
  {
    id: "r3",
    title: "Les changements climatiques et l'environnement québécois",
    level: "B2",
    topic: "Environnement",
    time_limit: 1200,
    created_at: new Date().toISOString(),
    text: `Le Québec, province aux ressources naturelles abondantes et aux hivers rigoureux, n'échappe pas aux conséquences des changements climatiques. Les scientifiques observent depuis plusieurs décennies une transformation profonde des écosystèmes québécois qui soulève des préoccupations importantes pour l'avenir de la province.

Le réchauffement climatique se manifeste de façon particulièrement prononcée dans le nord du Québec, où les températures augmentent deux à trois fois plus vite que dans le reste du monde. Cette situation affecte directement les communautés autochtones du Grand Nord, dont le mode de vie traditionnel dépend de la faune arctique et de la stabilité des conditions climatiques. La fonte du pergélisol compromet la stabilité des infrastructures et bouleverse les pratiques ancestrales de chasse et de pêche.

Sur le plan économique, les changements climatiques représentent à la fois des défis et des opportunités. L'industrie forestière doit s'adapter à la migration des espèces d'arbres et à l'augmentation des risques d'incendies de forêt. L'agriculture québécoise, quant à elle, bénéficie d'une saison de croissance plus longue mais doit faire face à des événements météorologiques extrêmes plus fréquents.

Face à ces enjeux, le gouvernement québécois a mis en place un plan d'action climatique ambitieux, visant à réduire les émissions de gaz à effet de serre de 37,5% d'ici 2030 par rapport aux niveaux de 1990. Des investissements massifs dans les énergies renouvelables, les transports électriques et l'efficacité énergétique des bâtiments sont prévus pour atteindre ces objectifs.`,
    questions: [
      {
        id: "q1",
        question:
          "Où les effets du réchauffement climatique sont-ils les plus prononcés au Québec ?",
        options: [
          "Dans les centres urbains",
          "Dans le nord du Québec",
          "Sur les côtes maritimes",
          "Dans les régions agricoles",
        ],
        correct_answer: 1,
        explanation:
          "Le texte précise que 'le réchauffement climatique se manifeste de façon particulièrement prononcée dans le nord du Québec'.",
      },
      {
        id: "q2",
        question:
          "Comment les changements climatiques affectent-ils les communautés autochtones du Grand Nord ?",
        options: [
          "Positivement, car l'hiver est moins rigoureux",
          "Négativement, car leur mode de vie traditionnel est perturbé",
          "Ils n'ont aucun impact sur ces communautés",
          "En améliorant leurs conditions économiques",
        ],
        correct_answer: 1,
        explanation:
          "Le texte mentionne que cela 'bouleverse les pratiques ancestrales de chasse et de pêche' et 'compromet la stabilité des infrastructures'.",
      },
      {
        id: "q3",
        question:
          "Quel est l'objectif du gouvernement québécois concernant les émissions de gaz à effet de serre ?",
        options: [
          "Les réduire de 25% d'ici 2025",
          "Les éliminer complètement d'ici 2050",
          "Les réduire de 37,5% d'ici 2030",
          "Les stabiliser au niveau actuel",
        ],
        correct_answer: 2,
        explanation:
          "Le texte mentionne 'réduire les émissions de gaz à effet de serre de 37,5% d'ici 2030 par rapport aux niveaux de 1990'.",
      },
      {
        id: "q4",
        question:
          "Quel avantage les changements climatiques apportent-ils à l'agriculture québécoise ?",
        options: [
          "Des prix plus élevés pour les produits",
          "Une saison de croissance plus longue",
          "Moins de ravageurs agricoles",
          "Des subventions gouvernementales plus importantes",
        ],
        correct_answer: 1,
        explanation:
          "Le texte indique que 'L'agriculture québécoise bénéficie d'une saison de croissance plus longue'.",
      },
    ],
  },
];

export const sampleListeningExercises: ListeningExercise[] = [
  {
    id: "l1",
    title: "Se présenter et parler de sa famille",
    level: "A1",
    audio_url: "/audio/a1-famille.mp3",
    duration: 120,
    topic: "Famille et présentation",
    created_at: new Date().toISOString(),
    transcript:
      "Bonjour, je m'appelle Marie Tremblay. J'ai trente-deux ans. Je suis de Montréal. J'ai une famille de quatre personnes : mon mari, mes deux enfants et moi. Mon mari s'appelle Pierre. Il est ingénieur. Ma fille s'appelle Sophie, elle a huit ans, et mon fils s'appelle Thomas, il a cinq ans. Nous habitons dans un appartement dans le quartier Rosemont.",
    questions: [
      {
        id: "q1",
        question: "Quel est le prénom de la femme qui parle ?",
        options: ["Sophie", "Marie", "Claire", "Julie"],
        correct_answer: 1,
        explanation:
          "La femme dit 'je m'appelle Marie Tremblay' au début.",
      },
      {
        id: "q2",
        question: "Combien d'enfants a Marie ?",
        options: ["Un enfant", "Deux enfants", "Trois enfants", "Pas d'enfants"],
        correct_answer: 1,
        explanation: "Elle dit 'mes deux enfants'.",
      },
      {
        id: "q3",
        question: "Quel est le métier du mari de Marie ?",
        options: ["Médecin", "Enseignant", "Ingénieur", "Avocat"],
        correct_answer: 2,
        explanation: "Elle dit 'Il est ingénieur'.",
      },
      {
        id: "q4",
        question: "Dans quel quartier habitent-ils ?",
        options: ["Plateau", "Rosemont", "Outremont", "Verdun"],
        correct_answer: 1,
        explanation:
          "Elle dit 'Nous habitons dans un appartement dans le quartier Rosemont.'",
      },
    ],
  },
  {
    id: "l2",
    title: "Une annonce à la radio",
    level: "B1",
    audio_url: "/audio/b1-radio.mp3",
    duration: 180,
    topic: "Médias et information",
    created_at: new Date().toISOString(),
    transcript:
      "Ici Radio-Québec, bonjour. Voici les informations de ce matin. La ville de Montréal annonce la fermeture temporaire du pont Jacques-Cartier pour travaux de rénovation, à partir du vendredi 15 mars jusqu'au dimanche 17 mars. Les automobilistes sont priés d'emprunter le pont Champlain ou le tunnel Louis-Hippolyte-La Fontaine comme itinéraires alternatifs. La Société de transport de Montréal augmentera la fréquence de ses services de bus et de métro pendant cette période pour faciliter les déplacements. Pour plus d'informations, consultez le site web de la ville ou appelez le 311.",
    questions: [
      {
        id: "q1",
        question: "Quel pont sera fermé pour des travaux ?",
        options: [
          "Pont Champlain",
          "Pont Jacques-Cartier",
          "Pont Victoria",
          "Pont Mercier",
        ],
        correct_answer: 1,
        explanation: "L'annonce mentionne 'la fermeture temporaire du pont Jacques-Cartier'.",
      },
      {
        id: "q2",
        question: "Combien de temps durera la fermeture ?",
        options: [
          "Un jour",
          "Deux jours",
          "Trois jours",
          "Une semaine",
        ],
        correct_answer: 2,
        explanation: "La fermeture va du vendredi 15 au dimanche 17 mars, soit 3 jours.",
      },
      {
        id: "q3",
        question:
          "Que fera la STM pendant la fermeture ?",
        options: [
          "Elle sera fermée",
          "Elle augmentera la fréquence de ses services",
          "Elle augmentera ses tarifs",
          "Elle offrira des trajets gratuits",
        ],
        correct_answer: 1,
        explanation:
          "L'annonce dit que la STM 'augmentera la fréquence de ses services de bus et de métro'.",
      },
    ],
  },
];

export const sampleSpeakingPrompts: SpeakingPrompt[] = [
  {
    id: "sp1",
    level: "A2",
    prompt:
      "Parlez de votre routine quotidienne. Que faites-vous le matin, l'après-midi et le soir ? (Parlez pendant environ 2 minutes)",
    duration: 120,
    topic: "Vie quotidienne",
    example_response:
      "Le matin, je me lève à 7 heures. Je prends une douche et je prends mon petit-déjeuner. Je mange des céréales et je bois du café. Ensuite, je vais au travail en métro. L'après-midi, je travaille jusqu'à 17 heures. Le soir, je rentre à la maison, je prépare le dîner et je regarde la télévision. Je me couche vers 22 heures.",
    created_at: new Date().toISOString(),
  },
  {
    id: "sp2",
    level: "B1",
    prompt:
      "Décrivez un événement culturel ou une fête importante dans votre pays d'origine. Expliquez ce que c'est, comment les gens le célèbrent et ce que cela représente pour vous. (Parlez pendant environ 3 minutes)",
    duration: 180,
    topic: "Culture et traditions",
    created_at: new Date().toISOString(),
  },
  {
    id: "sp3",
    level: "B2",
    prompt:
      "Selon vous, quels sont les avantages et les inconvénients du télétravail ? Donnez votre opinion personnelle avec des exemples concrets. (Parlez pendant environ 4 minutes)",
    duration: 240,
    topic: "Travail et société",
    created_at: new Date().toISOString(),
  },
  {
    id: "sp4",
    level: "A1",
    prompt:
      "Présentez-vous : donnez votre nom, votre âge, votre pays d'origine et votre profession. (Parlez pendant environ 1 minute)",
    duration: 60,
    topic: "Présentation personnelle",
    example_response:
      "Bonjour, je m'appelle Carlos. J'ai 28 ans. Je suis du Mexique, de Mexico. Je suis informaticien. J'aime le sport et la musique.",
    created_at: new Date().toISOString(),
  },
];

export const sampleWritingPrompts: WritingPrompt[] = [
  {
    id: "w1",
    level: "A2",
    prompt:
      "Vous voulez inviter un ami québécois à votre anniversaire. Écrivez-lui un message pour l'inviter. Donnez les informations importantes : la date, l'heure, le lieu et ce que vous ferez ensemble.",
    word_count_min: 60,
    word_count_max: 120,
    topic: "Communication informelle",
    created_at: new Date().toISOString(),
  },
  {
    id: "w2",
    level: "B1",
    prompt:
      "Vous avez récemment assisté à un événement culturel à Montréal (concert, exposition, festival, etc.). Écrivez un texte pour décrire cet événement, expliquer ce que vous avez aimé ou pas aimé, et recommander (ou non) cet événement à d'autres personnes.",
    word_count_min: 150,
    word_count_max: 250,
    topic: "Vie culturelle",
    created_at: new Date().toISOString(),
  },
  {
    id: "w3",
    level: "B2",
    prompt:
      "La ville de Montréal envisage d'interdire les voitures dans le centre-ville pendant les fins de semaine pour améliorer la qualité de l'air et favoriser les piétons. Rédigez une lettre à la mairie pour exprimer votre opinion sur cette mesure. Présentez des arguments pour ou contre cette proposition.",
    word_count_min: 250,
    word_count_max: 400,
    topic: "Vie urbaine et environnement",
    created_at: new Date().toISOString(),
  },
];
