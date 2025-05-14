type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
}

type ActressNationality = 
|"American"
|"British"
|"Australian"
|"Israeli-American"
|"South African"
|"French"
|"Indian"
|"Israeli"
|"Spanish"
|"South Korean"
|"Chinese"

const country: string[] = ["American", "British", "Australian", "Israeli-American", "South African", "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese"]

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: ActressNationality
}

function isActress(data: unknown): data is Actress {
  return (
  data !== null &&
  typeof data === "object" &&
  "id" in data &&
  typeof data.id === "number" &&
  "name" in data &&
  typeof data.name === "string" &&
  "biography" in data &&
  typeof data.biography === "string" &&
  "image" in data &&
  typeof data.image === "string" &&
  "birth_year" in data &&
  typeof data.birth_year === "number" &&
  "death_year" in data &&
  typeof data.birth_year === "number" &&
  "most_famous_movies" in data &&
  Array.isArray(data.most_famous_movies)&&
  data.most_famous_movies.length === 3 &&
  data.most_famous_movies.every(curElem => typeof curElem === "string") &&
  "awards" in data &&
  typeof data.awards === "string" &&
  "nationality" in data &&
  typeof data.nationality === "string" &&
  country.includes(data.nationality)
  )
}

async function getAddress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`);
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
    throw new Error("Formato dei dati non valido");
  }
  return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Errore durante il recupero dell'attrice:", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return null;
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
    }
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
          throw new Error("Formato dei dati non valido: non è un array");
    }
    const attricivalide = dati.filter(isActress);
    return attricivalide
  } catch (error) {
    if (error instanceof Error) {
      console.log("Errore durante il recupero dell'attrice:", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return [];
  }
}

// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const attrici = await Promise.all(ids.map(id => getAddress(id)));
    return attrici;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici:", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return []
  }

}
