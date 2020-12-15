interface IBaseTags{
  [index: string]: string
}

class Tags {
  itemTags: IBaseTags = {
    anime: 'Anime',
    dashboard: 'Dashboard',
    diversao: 'Diversão',
    utilidades: 'Utilidades',
    social: 'Social',
    jogos: 'Jogos',
    musica: 'Música',
    moderacao: 'Moderação',
    economia: 'Economia',
    fornite: 'Fortnite',
    lol: 'League of Legends',
    minecraft: 'Minecraft',
    hytale: 'Hytale',
    nsfw: 'NSFW',
    outros: 'Outros'
  }

  convertTags (tags: string[]): string[] {
    for (let i = 0; i < tags.length; i++) {
      tags[i] = this.itemTags[tags[i]]
    }
    return tags
  }
}

export {
  IBaseTags,
  Tags
}

export default Tags
