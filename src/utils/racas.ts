/**
 * Species and breed catalog used by the pet forms. It lives in the bundle, not in the database, so
 * the breed picker works offline and needs no sync. The stored value is still free text (`pet.raca`),
 * so breeds outside this list remain valid.
 */

export const ESPECIES = ['Canino', 'Felino'];

export const SEXOS = ['Macho', 'Fêmea'];

export const RACA_SRD = 'SRD (Sem raça definida)';

const CANINOS = [
  'Akita',
  'American Staffordshire Terrier',
  'Basset Hound',
  'Beagle',
  'Bernese',
  'Bichon Frisé',
  'Border Collie',
  'Boston Terrier',
  'Boxer',
  'Buldogue Francês',
  'Buldogue Inglês',
  'Bull Terrier',
  'Cane Corso',
  'Cavalier King Charles Spaniel',
  'Chihuahua',
  'Chow Chow',
  'Cocker Spaniel',
  'Dachshund (Salsicha)',
  'Dálmata',
  'Doberman',
  'Dogo Argentino',
  'Dogue Alemão',
  'Fila Brasileiro',
  'Fox Paulistinha (Terrier Brasileiro)',
  'Galgo',
  'Golden Retriever',
  'Husky Siberiano',
  'Jack Russell Terrier',
  'Labrador Retriever',
  'Lhasa Apso',
  'Malamute do Alasca',
  'Maltês',
  'Pastor Alemão',
  'Pastor Australiano',
  'Pastor Belga Malinois',
  'Pequinês',
  'Pinscher',
  'Pit Bull',
  'Poodle',
  'Pug',
  'Rottweiler',
  'Samoieda',
  'São Bernardo',
  'Schnauzer',
  'Shar-Pei',
  'Shiba Inu',
  'Shih Tzu',
  'Spitz Alemão (Lulu da Pomerânia)',
  'Staffordshire Bull Terrier',
  'Terra Nova',
  'Weimaraner',
  'West Highland White Terrier',
  'Whippet',
  'Yorkshire Terrier',
];

const FELINOS = [
  'Abissínio',
  'American Shorthair',
  'Angorá Turco',
  'Azul Russo',
  'Balinês',
  'Bengal',
  'Bobtail Japonês',
  'Bombaim',
  'British Shorthair',
  'Burmês',
  'Chartreux',
  'Cornish Rex',
  'Devon Rex',
  'Exótico',
  'Himalaio',
  'Korat',
  'LaPerm',
  'Maine Coon',
  'Manx',
  'Munchkin',
  'Norueguês da Floresta',
  'Ocicat',
  'Oriental de Pelo Curto',
  'Persa',
  'Ragdoll',
  'Sagrado da Birmânia',
  'Savannah',
  'Scottish Fold',
  'Selkirk Rex',
  'Siamês',
  'Siberiano',
  'Snowshoe',
  'Somali',
  'Sphynx',
  'Tonquinês',
  'Toyger',
  'Van Turco',
];

function withSrdFirst(racas: string[]): string[] {
  return [RACA_SRD, ...[...racas].sort((a, b) => a.localeCompare(b, 'pt-BR'))];
}

const RACAS_POR_ESPECIE: Record<string, string[]> = {
  Canino: withSrdFirst(CANINOS),
  Felino: withSrdFirst(FELINOS),
};

/** Breeds for the given species, SRD first and the rest alphabetical; empty for an unknown species. */
export function racasDaEspecie(especie: string): string[] {
  return RACAS_POR_ESPECIE[especie] ?? [];
}
