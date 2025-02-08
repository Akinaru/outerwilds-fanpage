export const eoteDialogue = {
    "start": {
      text: "*ajuste nerveusement ses notes* ATTENTION : Ce qui suit contient des révélations majeures sur l'extension Echoes of the Eye. Si tu souhaites découvrir ses mystères par toi-même, je te conseille de partir maintenant.",
      responses: [
        {
          text: "Je souhaite continuer malgré tout",
          nextId: "begin_story"
        },
        {
          text: "Tu as raison, je préfère découvrir par moi-même",
          nextId: "leave"
        }
      ]
    },
    "leave": {
      text: "*sourire bienveillant* Une sage décision. Certaines découvertes méritent d'être faites par soi-même. Bon voyage parmi les étoiles !",
      responses: []
    },
    "begin_story": {
      text: "As-tu remarqué quelque chose d'étrange dans les photos du satellite ? Cette anomalie qui apparaît... et disparaît.",
      responses: [
        {
          text: "L'étrange anneau lumineux ?",
          nextId: "ring"
        },
        {
          text: "Je n'ai rien remarqué de particulier.",
          nextId: "explain"
        }
      ]
    },
    "explain": {
      text: "Regarde plus attentivement. Il y a quelque chose qui bloque périodiquement la lumière des étoiles. Comme si... quelque chose d'énorme se déplaçait devant elles.",
      responses: [
        {
          text: "Maintenant que tu le dis...",
          nextId: "ring"
        }
      ]
    },
    "ring": {
      text: "Exact. Une structure artificielle, cachée à la vue de tous depuis si longtemps. Mais pourquoi ? Et qui l'a construite ?",
      responses: [
        {
          text: "Les Nomaï ?",
          nextId: "not_nomai"
        },
        {
          text: "Une autre espèce ?",
          nextId: "mysterious_species"
        }
      ]
    },
    "not_nomai": {
      text: "Non... Le style architectural est complètement différent. Et les symboles qu'on y trouve... je n'ai jamais rien vu de tel dans les ruines Nomaï.",
      responses: [
        {
          text: "Que suggères-tu ?",
          nextId: "mysterious_species"
        }
      ]
    },
    "mysterious_species": {
      text: "Il y a tant de questions sans réponses. Cette structure semble avoir été délibérément dissimulée. Comme si... quelqu'un ne voulait pas qu'on la trouve.",
      responses: [
        {
          text: "Comment pouvons-nous l'explorer ?",
          nextId: "explore"
        },
        {
          text: "Peut-être devrait-elle rester cachée...",
          nextId: "warning"
        }
      ]
    },
    "warning": {
      text: "La curiosité est dans notre nature. C'est ce qui nous a menés jusqu'aux étoiles. Mais parfois... parfois, certaines découvertes viennent avec leur lot de dangers.",
      responses: [
        {
          text: "Je comprends les risques.",
          nextId: "explore"
        }
      ]
    },
    "explore": {
      text: "Il y a un endroit... un point d'observation particulier depuis lequel on pourrait peut-être... Mais sois prudent. La nuit peut être plus sombre qu'elle n'y paraît.",
      responses: [
        {
          text: "Je trouverai un moyen d'y accéder.",
          nextId: "end"
        }
      ]
    },
    "end": {
      text: "Bonne chance, voyageur. Et n'oublie pas... parfois, la lumière peut être notre meilleure alliée dans l'obscurité.",
      responses: []
    }
};

export default eoteDialogue;