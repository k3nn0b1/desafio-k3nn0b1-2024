const INITIAL_RECINTOS = [
  {
    numero: 1,
    biomas: ["savana"],
    tamanho: 10,
    ocupacao: 3,
    animais: ["MACACO"],
  },
  { numero: 2, bioma: "floresta", tamanho: 5, ocupacao: 0, animais: [] },
  {
    numero: 3,
    biomas: ["savana", "rio"],
    tamanho: 7,
    ocupacao: 2,
    animais: ["GAZELA"],
  },
  { numero: 4, bioma: "rio", tamanho: 8, ocupacao: 0, animais: [] },
  {
    numero: 5,
    biomas: ["savana"],
    tamanho: 9,
    ocupacao: 3,
    animais: ["LEAO"],
  },
];

const INITIAL_ANIMAIS = {
  LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
  LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
  CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
  MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
  GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
  HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
};

export class RecintosZoo {
  constructor() {
    this.recintos = [...INITIAL_RECINTOS];
    this.animais = { ...INITIAL_ANIMAIS };
  }

  analisaRecintos(novoAnimal, quantidade) {
    if (!this.animais[novoAnimal]) {
      return { erro: "Animal inválido", recintosViaveis: null };
    }

    if (quantidade <= 0) {
      return { erro: "Quantidade inválida", recintosViaveis: null };
    }

    const animalInfo = this.animais[novoAnimal];
    const recintosViaveis = [];

    this.recintos.forEach((recinto) => {
      const biomasDoRecinto = recinto.biomas || [recinto.bioma];
      const espacoLivre = recinto.tamanho - recinto.ocupacao;
      let espacoNecessario = animalInfo.tamanho * quantidade;

      const outrosAnimaisNoRecinto = recinto.animais.length > 0;

      if (
        outrosAnimaisNoRecinto &&
        !recinto.animais.every((animal) => animal === novoAnimal)
      ) {
        espacoNecessario += 1;
      }

      if (espacoLivre < espacoNecessario) {
        return;
      }

      const biomasComuns = biomasDoRecinto.filter((elemento) =>
        animalInfo.biomas.includes(elemento)
      );
      if (biomasComuns.length === 0) {
        return;
      }

      if (
        (animalInfo.carnivoro && outrosAnimaisNoRecinto) ||
        (!animalInfo.carnivoro &&
          recinto.animais.some((animal) => INITIAL_ANIMAIS[animal].carnivoro))
      ) {
        const outrosSaoIguais = recinto.animais.every(
          (animal) => animal === novoAnimal
        );
        if (!outrosSaoIguais) {
          return;
        }
      }

      if (
        novoAnimal === "HIPOPOTAMO" &&
        (!biomasDoRecinto.includes("savana") ||
          !biomasDoRecinto.includes("rio"))
      ) {
        return;
      }

      if (novoAnimal === "MACACO" && !outrosAnimaisNoRecinto && quantidade < 2) {
        return;
      }

      const novoEspacoLivre = espacoLivre - espacoNecessario;

      recintosViaveis.push({
        numero: recinto.numero,
        descricao: `Recinto ${recinto.numero} (espaço livre: ${novoEspacoLivre} total: ${recinto.tamanho})`,
        espacoLivre: novoEspacoLivre,
      });
    });

    if (recintosViaveis.length > 0) {
      recintosViaveis.sort((a, b) => a.numero - b.numero);
      return {
        recintosViaveis: recintosViaveis.map((r) => r.descricao),
      };
    } else {
      return { erro: "Não há recinto viável", recintosViaveis: null };
    }
  }
}
