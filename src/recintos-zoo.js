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
      
        // Iterar sobre os recintos e verificar viabilidade
        this.recintos.forEach((recinto) => {
          const biomasDoRecinto = recinto.biomas || [recinto.bioma];
          const espacoLivre = recinto.tamanho - recinto.ocupacao;
          let espacoNecessario = animalInfo.tamanho * quantidade;
      
          const outrosAnimaisNoRecinto = recinto.animais.length > 0;
      
          // Penalidade para convivência com outros animais, exceto para MACACO
          if (
            outrosAnimaisNoRecinto &&
            !recinto.animais.every((animal) => animal === novoAnimal) &&
            novoAnimal !== "MACACO"
          ) {
            espacoNecessario += 1; // Adiciona espaço extra se o animal for diferente dos já presentes
          }
      
          // Se o espaço livre não for suficiente, ignora este recinto
          if (espacoLivre < espacoNecessario) {
            return;
          }
      
          // Verifica se o recinto tem biomas compatíveis com o animal
          const biomasComuns = biomasDoRecinto.filter((elemento) =>
            animalInfo.biomas.includes(elemento)
          );
          if (biomasComuns.length === 0) {
            return;
          }
      
          // Se o animal for carnívoro, verifica se todos os animais no recinto são do mesmo tipo
          if (animalInfo.carnivoro && outrosAnimaisNoRecinto) {
            const outrosSaoIguais = recinto.animais.every(
              (animal) => animal === novoAnimal
            );
            if (!outrosSaoIguais) {
              return;
            }
          }
      
          // Condição especial para o hipopótamo que requer dois biomas específicos
          if (
            novoAnimal === "HIPOPOTAMO" &&
            (!biomasDoRecinto.includes("savana") ||
              !biomasDoRecinto.includes("rio"))
          ) {
            return;
          }
      
          // O macaco precisa estar com outros animais
          if (novoAnimal === "MACACO" && !outrosAnimaisNoRecinto) {
            return;
          }
      
          // Calcular o espaço restante após a adição do novo animal
          const novoEspacoLivre = espacoLivre - espacoNecessario;
      
          // Adicionar o recinto como viável
          recintosViaveis.push({
            numero: recinto.numero,
            descricao: `Recinto ${recinto.numero} (espaço livre: ${novoEspacoLivre} total: ${recinto.tamanho})`,
            espacoLivre: novoEspacoLivre,
          });
        });
      
        // Ordena os recintos viáveis pelo número do recinto
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