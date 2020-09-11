module.exports = () => {
    const tags = {
        anime: "Anime",
        dashboard: "Dashboard",
        diversao: "Diversão",
        utilidades: "Utilidades",
        social: "Social",
        jogos: "Jogos",
        musica: "Música",
        moderacao: "Moderação",
        economia: "Economia",
        fornite: "Fortnite",
        lol: "League of Legends",
        minecraft: "Minecraft",
        hytale: "Hytale",
        nsfw: "NSFW",
        outros: "Outros"
    };
    /**
     * 
     * @param {String[]} tagArray
     * @returns {String[]}
     */
    function convertTags(tagArray){
        for(let i = 0; i < tagArray.length; i++){
            tagArray[i] = tags[tagArray[i]];
        }
        return tagArray;
    }

    return {
        tags,
        convertTags
    }
}
