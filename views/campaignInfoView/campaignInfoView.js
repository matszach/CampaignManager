class CampaignInfoViewController extends ViewController{

    html = `
    <div class='componentDiv'>
        <div class='componentTitleDiv'>
            <p class='componentTitle'>Campaign Info</p>
        </div>
        <div class='componentCampaignInfoDiv'>
            <input type='text' id='campaignInfoTitle' class='viewTextfield' 
                onchange='noteView.loadSelectItemsBySearch()' placeholder='Campaign title ...'/>
            <input type='text' id='campaignInfoSubtitle' class='viewTextfield' 
                onchange='noteView.loadSelectItemsBySearch()' placeholder='Campaign subtitle ...'/>
            <input type='text' id='campaignInfoVersion' class='viewTextfield' 
                onchange='noteView.loadSelectItemsBySearch()' placeholder='Campaign version ...'/>
            <textarea id='campaignInfoDescription' class='viewTextarea' 
                spellcheck="false" placeholder='Campaign description ...'></textarea>
        </div>
        <div class='componentButtonDiv'>
            <input type='submit' id='campaignInfoSaveButton'
                onclick='campaignInfoView.updateCampaignInfo()' value='Save'/>
        </div>
    </div>
    `;
    campaignInfo;

    constructor(campaignInfo){
        super()
        this.campaignInfo = campaignInfo;
    }

    init(){
        this.displayCampaignInfo();
    }

    displayCampaignInfo(){
        $('#campaignInfoTitle').val(this.campaignInfo.title);
        $('#campaignInfoSubtitle').val(this.campaignInfo.subtitle);
        $('#campaignInfoVersion').val(this.campaignInfo.version);
        $('#campaignInfoDescription').val(this.campaignInfo.description);
    }

    updateCampaignInfo(){
        this.campaignInfo.title = $('#campaignInfoTitle').val();
        this.campaignInfo.subtitle = $('#campaignInfoSubtitle').val();
        this.campaignInfo.version = $('#campaignInfoVersion').val();
        this.campaignInfo.description = $('#campaignInfoDescription').val();
    }

}