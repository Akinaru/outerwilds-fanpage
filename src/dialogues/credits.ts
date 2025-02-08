export const creditsDialogue = {
    "start": {
      text: "*ajuste ses instruments* Ah, tu t'intéresses à l'équipe derrière cette aventure spatiale ?",
      responses: [
        {
          text: "Qui est derrière ce projet ?",
          nextId: "about_creator"
        },
        {
          text: "Parle-moi des créateurs originaux",
          nextId: "about_mobius"
        },
        {
          text: "Je n'ai plus de questions.",
          nextId: "goodbye"
        }
      ]
    },
    "about_creator": {
      text: "Un passionné d'exploration et de mystères... *ajuste son télescope* Quelqu'un qui, comme toi, est fasciné par les secrets de l'univers et souhaite partager cette fascination avec d'autres voyageurs des étoiles.",
      responses: [
        {
          text: "Non, je veux vraiment savoir qui tu es !",
          nextId: "about_creator_insist"
        },
        {
          text: "J'ai d'autres questions.",
          nextId: "start"
        },
        {
          text: "Je n'ai plus de questions.",
          nextId: "goodbye"
        }
      ]
    },
    "about_creator_insist": {
      text: "*fait un clin d'œil complice* Eh bien, puisque tu insistes... On m'appelle Aki. Si tu veux me contacter, tu peux m'envoyer un signal à maxime@gallotta.fr.",
      responses: [
        {
          text: "J'ai d'autres questions.",
          nextId: "start"
        },
        {
          text: "Je n'ai plus de questions.",
          nextId: "goodbye"
        }
      ]
    },
    "about_mobius": {
      text: "*sort un vieux livre poussiéreux* Ah, Mobius Digital... *tourne délicatement les pages* Un studio extraordinaire fondé par Alex Beachum et Loan Verneau. Ce sont eux qui ont créé l'œuvre originale d'Outer Wilds.",
      responses: [],
      autoNext: "about_mobius_2"
    },
    "about_mobius_2": {
      text: "*pointe une constellation* Leur vision a donné naissance à un univers unique où la curiosité et la découverte sont au cœur de l'aventure. Tout a commencé comme un projet étudiant d'Alex à l'USC, avant de devenir ce chef-d'œuvre que nous connaissons.",
      responses: [
        {
          text: "J'ai d'autres questions.",
          nextId: "start"
        },
        {
          text: "Je n'ai plus de questions.",
          nextId: "goodbye"
        }
      ]
    },
    "goodbye": {
      text: "Que les étoiles illuminent ton chemin, voyageur. *range son carnet de notes* J'espère te revoir bientôt dans l'immensité de l'espace !",
      responses: []
    }
  };