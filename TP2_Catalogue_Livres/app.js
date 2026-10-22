// TP 2 - Formulaires et événements - Vue.js 3 (Options API)
// Le dossier démarre avec les exemples fournis dans books.json.

const { createApp } = Vue;

createApp({
  data() {
    return {
      books: [],
      newBook: this.livreVide(),
      nouveauMotCle: '',
      recherche: '',
      filtreGenre: 'tous',
      erreurChargement: ''
    };
  },

  computed: {
    // PARTIE 2 : title et author non vides (même si l'utilisateur a mis des espaces)
    formulaireValide() {
      return this.newBook.title.trim() !== '' && this.newBook.author.trim() !== '';
    },
    nombreFavoris() {
      return this.books.filter(book => book.isFav).length;
    },
    booksAffiches() {
      const texte = this.recherche.trim().toLowerCase();
      return this.books.filter(book => {
        const correspondRecherche = book.title.toLowerCase().includes(texte)
          || book.author.toLowerCase().includes(texte);
        const correspondGenre = this.filtreGenre === 'tous' || book.genre === this.filtreGenre;
        return correspondRecherche && correspondGenre;
      });
    }
  },

  methods: {
    livreVide() {
      return { title: '', author: '', year: null, genre: 'Roman', isFav: false, keywords: [] };
    },

    // PARTIE 1 : ajouter une COPIE du livre, avec un nouvel id
    ajouterLivre() {
      if (!this.formulaireValide) return;
      const nouvelId = this.books.reduce((max, book) => Math.max(max, Number(book.id) || 0), 0) + 1;
      this.books.push({
        ...this.newBook,
        id: nouvelId,
        keywords: [...this.newBook.keywords]
      });
      this.newBook = this.livreVide();
      this.nouveauMotCle = '';
    },

    // PARTIE 3 : comparer les identifiants, pas les objets
    supprimerLivre(book) {
      this.books = this.books.filter(item => item.id !== book.id);
    },

    // PARTIE 4 : favori au clic sur la carte
    toggleFavori(book) {
      book.isFav = !book.isFav;
    },

    // PARTIE 5 : entrée -> ajout du mot-clé, sans doublon
    ajouterMotCle() {
      const mot = this.nouveauMotCle.trim();
      if (mot !== '' && !this.newBook.keywords.some(k => k.toLowerCase() === mot.toLowerCase())) {
        this.newBook.keywords.push(mot);
      }
      this.nouveauMotCle = '';
    },
    retirerMotCle(mot) {
      this.newBook.keywords = this.newBook.keywords.filter(k => k !== mot);
    },
    iconeGenre(genre) {
      const icones = { Roman: '📖', 'Science-fiction': '🚀', Fantastique: '🪄', Développement: '💡', Autre: '📚' };
      return icones[genre] || '📚';
    }
  },

  async mounted() {
    // Lancer avec Live Server pour pouvoir lire books.json par fetch().
    try {
      const reponse = await fetch('books.json');
      if (!reponse.ok) throw new Error('HTTP ' + reponse.status);
      const resultat = await reponse.json();
      if (!Array.isArray(resultat)) throw new Error('Le fichier books.json doit contenir un tableau.');
      this.books = resultat.map(book => ({ ...book, keywords: Array.isArray(book.keywords) ? [...book.keywords] : [] }));
    } catch (erreur) {
      this.erreurChargement = 'Impossible de charger books.json. Ouvrez le projet avec Live Server (VS Code).';
      console.error('Chargement des livres :', erreur);
    }
  }
}).mount('#app');
