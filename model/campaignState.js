class CampaignState{
    campaignInfo;
    characterRepository;
    locationRepository;
    noteRepository;
    map;
    mapEditorData;
}

class CampaignInfo{
    title;
    subtitle;
    version;
    description;

    reload(loadedCampaignInfo){
        this.title = loadedCampaignInfo.title;
        this.subtitle = loadedCampaignInfo.subtitle;
        this.version = loadedCampaignInfo.version;
        this.description = loadedCampaignInfo.description;
    }
}