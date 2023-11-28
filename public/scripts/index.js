// Activate carousel on equipment show page
$(function () {
    $('.carousel-inner').find('.carousel-item:first').addClass("active");
})

function ValidateImageFileSize(file) {
    //console.log("File");
    let maxFileSize = 1; // in MB
    let fileSize = file.files[0].size / 1024 / 1024; // convert to MB
    let fileName = file.files[0].name;
    if (fileSize > maxFileSize) {
        $(file).val(''); //for clearing with Jquery
        $(".custom-file-label").html("");
        alert('File size exceeds ' + maxFileSize + ' MB');
    } else {
        $(".custom-file-label").html(fileName);
        document.getElementById("add-image-label").classList.add("preview-image-wrapper");
        document.getElementById("preview-img").src = URL.createObjectURL(file.files[0]);
    }
}

function ValidateDatasheetFileSize(file) {
    let maxFileSize = 3; // in MB
    let fileSize = file.files[0].size / 1024 / 1024; // convert to MB
    let fileName = file.files[0].name;
    if (fileSize > maxFileSize) {
        $(file).val(''); //for clearing with Jquery
        $(".custom-file-label").html("");
        alert('File size exceeds ' + maxFileSize + ' MB');
    } else {
        $(".custom-file-label").html(fileName);
    }
}

// function is called when any equipment-index-card-image is clicked
function createComparisonSet(element) {
    let comparisonArray = []; // holds the ids of equipment to compare
    let compareSetIds = new Set();
    let comparisonArrayNames = []; // holds the names of equipment to compare
    let compareSetNames = new Set();
    let idKey = 'compareSetId';
    let nameKey = 'compareSetName';
    let maxCompare = 2;

    if (sessionStorage.getItem(idKey)) {
        comparisonArray = JSON.parse(sessionStorage.getItem(idKey));
        comparisonArray.forEach(id => {
            compareSetIds.add(id);
        })
    }

    if (sessionStorage.getItem(nameKey)) {
        comparisonArrayNames = JSON.parse(sessionStorage.getItem(nameKey));
        comparisonArrayNames.forEach(name => {
            compareSetNames.add(name);
        })
    }

    let value = $(element).parent().parent().find(".store-equipmentId").text(); // read from hidden element
    let name = $(element).parent().parent().find(".store-equipmentName").text(); // read from hidden element
    if (compareSetIds.has(value)) {
        compareSetIds.delete(value);
        compareSetNames.delete(name);
        $(element).parent().parent().removeClass('comparison-selected');
    } else {
        if (compareSetIds.size < maxCompare) {
            compareSetIds.add(value);
            compareSetNames.add(name);
            $(element).parent().parent().addClass('comparison-selected');
        }
    }
    comparisonArray = [...compareSetIds];
    comparisonArrayNames = [...compareSetNames];

    $('#compareSetStore').val(comparisonArray.join());
    $('#compareSetDisplay').val(comparisonArrayNames.join(' & '));

    sessionStorage.setItem(idKey, JSON.stringify(comparisonArray));
    sessionStorage.setItem(nameKey, JSON.stringify(comparisonArrayNames));

}

$(function () {
    let idKey = 'compareSetId';
    let nameKey = 'compareSetName';
    let arrayOfIds = [];

    if (sessionStorage.getItem(idKey)) {
        $(".store-equipmentId").each(function () {
            arrayOfIds = JSON.parse(sessionStorage.getItem(idKey));
            let storeEquipmentIdText = this.innerHTML;
            if (arrayOfIds.includes(storeEquipmentIdText)) {
                $(this).parent().parent().addClass('comparison-selected');
            }
        });
        comparisonArray = JSON.parse(sessionStorage.getItem(idKey));
        $('#compareSetStore').val(comparisonArray.join());
        comparisonArrayNames = JSON.parse(sessionStorage.getItem(nameKey));
        $('#compareSetDisplay').val(comparisonArrayNames.join(' & '));
    }
})

function clearSelected() {
    let idKey = 'compareSetId';
    let nameKey = 'compareSetName';

    if (sessionStorage.getItem(idKey)) {
        sessionStorage.removeItem(idKey);
    }

    if (sessionStorage.getItem(nameKey)) {
        sessionStorage.removeItem(nameKey);
    }

    $('.equipment-index-card').removeClass('comparison-selected');
    $('#compareSetDisplay').val('');
    $('#compareSetStore').val('');
}

// Remember search terms
function submitSearchTerms(element) {
    let searchTerms = $('#search-form-widget').val();
}

// On page load restore search terms from session memory
// $(function () {
//     if (sessionStorage.getItem('searchTerms')) {
//         $('#searchTerms').val(JSON.parse(sessionStorage.getItem('searchTerms')));
//     }
// })
function handleProduct (id){
    document.getElementById("c"+ id).checked = !document.getElementById("c"+ id).checked;

}
function handleCompare(){
    let temp = document.getElementsByClassName("detect");
    let tempString = []
   for(let i = 0, len = temp.length | 0; i <len; i = i + 1 | 0){
       if(temp[i].checked){
          tempString.push(temp[i].id.substring(1))
       }
   }
   $('#id').val(tempString)
   $('#compareForm').submit()

}

function clearAllChecks (){
    $('#filter_mining_type_underground').prop('checked', false);
    $('#filter_mining_type_surface').prop("checked", false);
    $('#filter_mining_type_mineral_processing').prop("checked", false);
    $('#filter_mineral_gold').prop("checked", false);
    $('#filter_mineral_coal').prop("checked", false);
    $('#filter_mineral_platinum').prop("checked", false);
    $('#filter_mineral_base_metal').prop("checked", false);
    $('#filter_mineral_other').prop("checked", false);    
    $('#filter_reef_type_massive').prop("checked", false);
    $('#filter_reef_type_narrow').prop("checked", false);
    $('#filter_mining_method_conventional').prop("checked", false);
    $('#filter_mining_method_hybrid').prop("checked", false);
    $('#filter_mining_method_mechanised').prop("checked", false);
    $('#filter_mining_method_autonomous').prop("checked", false);
    $('#filter_mining_cycle_shaft_sinking').prop("checked", false);
    $('#filter_mining_cycle_access_development').prop("checked", false);
    $('#filter_mining_cycle_Prospecting').prop("checked", false);
    $('#filter_mining_cycle_access_development').prop("checked", false);    
    $('#filter_mining_cycle_stopping').prop("checked", false);
    $('#filter_mining_activity_drilling').prop("checked", false);
    $('#filter_mining_activity_blasting').prop("checked", false);
    $('#filter_mining_activity_cleaning').prop("checked", false);
    $('#filter_mining_activity_supporting').prop("checked", false);
    $('#filter_energy_source_pneumatic').prop("checked", false);    
    $('#filter_energy_source_water_hydraulic').prop("checked", false);
    $('#filter_energy_source_electric_ac').prop("checked", false);
    $('#filter_energy_source_diesel_electro_hydraulic').prop("checked", false);
    $('#filter_energy_source_battery').prop("checked", false);    
    $('#filter_energy_source_fuel_cell').prop("checked", false);    
    $('#filter_logistics_transport').prop("checked", false);
    $('#filter_logistics_tramming_and_rock_handling').prop("checked", false);    
    $('#filter_it_and_comms_sensing').prop("checked", false);
    $('#filter_it_and_comms_controls').prop("checked", false);
    $('#filter_it_and_comms_communications').prop("checked", false);
    $('#filter_it_and_comms_data_integration').prop("checked", false);    
    $('#filter_it_and_comms_data_analysis').prop("checked", false);
    $('#filter_it_and_comms_management_systems').prop("checked", false);
    window.open("/equipment", "_self")
    
    // $('#filterForm').submit()
}

function onChangeFilterChecks() {
    let mineralFilter = [];
    let miningMethodFilter = [];
    let miningTypeFilter = [];
    let mineActivityFilter = [];
    let miningCycleFilter = [];
    let energySourceFilter=[];
    let LogisticsAndMaterialsFilter=[];
    let ITCommsFilter=[];
    let reefTypeFilter=[];

    // miningType
    if ($('#filter_mining_type_underground').prop("checked") == true) {
        miningTypeFilter.push('Underground Mining')
    }
    if ($('#filter_mining_type_surface').prop("checked") == true) {
        miningTypeFilter.push('Surface Mining')
    }
    if ($('#filter_mining_type_mineral_processing').prop("checked") == true) {
        miningTypeFilter.push('Mineral Processing and Beneficiation')
    }
    if (miningTypeFilter.length > 0) {
        $('#miningTypeFilter').val(miningTypeFilter.join(','))
    }

    // miningCycle
    if ($('#filter_mining_cycle_Prospecting').prop("checked") == true) {
        miningCycleFilter.push('Prospecting')
    }
    if ($('#filter_mining_cycle_shaft_sinking').prop("checked") == true) {
        miningCycleFilter.push('Shaft Sinking')
    }
    if ($('#filter_mining_cycle_access_development').prop("checked") == true) {
        miningCycleFilter.push('Access Development')
    }
    if ($('#filter_mining_cycle_development').prop("checked") == true) {
        miningCycleFilter.push('Development')
    }
    if ($('#filter_mining_cycle_stopping').prop("checked") == true) {
        miningCycleFilter.push('Stoping')
    }
    if (miningCycleFilter.length > 0) {
        $('#miningCycleFilter').val(miningCycleFilter.join(','))
    }

    // mineActivity
    if ($('#filter_mining_activity_drilling').prop("checked") == true) {
        mineActivityFilter.push('Drilling')
    }
    if ($('#filter_mining_activity_blasting').prop("checked") == true) {
        mineActivityFilter.push('Blasting')
    }
    if ($('#filter_mining_activity_cleaning').prop("checked") == true) {
        mineActivityFilter.push('Cleaning')
    }
    if ($('#filter_mining_activity_supporting').prop("checked") == true) {
        mineActivityFilter.push('Supporting')
    }
    if (mineActivityFilter.length > 0) {
        $('#miningActivityFilter').val(mineActivityFilter.join(','))
    }

    // mining method
    if ($('#filter_mining_method_mechanised').prop("checked") == true) {
        miningMethodFilter.push('Mechanised')
    }
    if ($('#filter_mining_method_conventional').prop("checked") == true) {
        miningMethodFilter.push('Conventional')
    }
    if ($('#filter_mining_method_hybrid').prop("checked") == true) {
        miningMethodFilter.push('Hybrid')
    }
    if ($('#filter_mining_method_autonomous').prop("checked") == true) {
        miningMethodFilter.push('Autonomous')
    }
    if (miningMethodFilter.length > 0) {
        $('#miningMethodFilter').val(miningMethodFilter.join(','))
    }

    // mineral
    if ($('#filter_mineral_gold').prop("checked") == true) {
        mineralFilter.push('Gold & Platinum')
    }
    if ($('#filter_mineral_platinum').prop("checked") == true) {
        mineralFilter.push('Diamonds')
    }
    if ($('#filter_mineral_coal').prop("checked") == true) {
        mineralFilter.push('Coal')
    }
    if ($('#filter_mineral_base_metal').prop("checked") == true) {
        mineralFilter.push('Base Metals')
    }
    if ($('#filter_mineral_other').prop("checked") == true) {
        mineralFilter.push('Other')
    }
    if (mineralFilter.length > 0) {
        $('#mineralFilter').val(mineralFilter.join(','))
    }

    //ITComms
    if($('#filter_it_and_comms_sensing').prop("checked") == true)
    {
        ITCommsFilter.push("Sensing");
    }    
    if($('#filter_it_and_comms_controls').prop("checked") == true)
    {
        ITCommsFilter.push("Controls");
    }
    if($('#filter_it_and_comms_communications').prop("checked") == true)
    {
        ITCommsFilter.push("Communications");        
    }
    if($('#filter_it_and_comms_data_integration').prop("checked") == true)
    {
        ITCommsFilter.push("Data Integration");        
    }
    if($('#filter_it_and_comms_data_analysis').prop("checked") == true)
    {
        ITCommsFilter.push("Data Analysis");        
    }
    if($('#filter_it_and_comms_management_systems').prop("checked") == true)
    {
        ITCommsFilter.push("Management Systems");        
    }
    if (ITCommsFilter.length > 0) {
        $('#ITCommsFilter').val(ITCommsFilter.join(','))
    }

    //Logistics & materials handling
    if($('#filter_logistics_pipe_services').prop("checked") == true)
    {
        LogisticsAndMaterialsFilter.push("Pipe Services");
    }
    if($('#filter_logistics_transport').prop("checked") == true)
    {
        LogisticsAndMaterialsFilter.push("Transport");
    }
    if($('#filter_logistics_tramming_and_rock_handling').prop("checked") == true)
    {
        LogisticsAndMaterialsFilter.push("Tramming & Rock Handling");
    }
    if (LogisticsAndMaterialsFilter.length > 0) {
        $('#LogisticsAndMaterialsFilter').val(LogisticsAndMaterialsFilter.join(','))
    }

    //Energy source
    if($('#filter_energy_source_pneumatic').prop("checked") == true)
    {
        energySourceFilter.push("Pneumatic");
    }
    if($('#filter_energy_source_water_hydraulic').prop("checked") == true)
    {
        energySourceFilter.push("Water hydraulic");
    }
    if($('#filter_energy_source_electric_ac').prop("checked") == true)
    {
        energySourceFilter.push("Electric AC");
    }
    if($('#filter_energy_source_diesel_electro_hydraulic').prop("checked") == true)
    {
        energySourceFilter.push("Diesel Electro-hydraulic");
    }
    if($('#filter_energy_source_battery').prop("checked") == true)
    {
        energySourceFilter.push("Battery");
    }
    if($('#filter_energy_source_fuel_cell').prop("checked") == true)
    {
        energySourceFilter.push("Fuel Cell");
    }
    if (energySourceFilter.length > 0) {
        $('#energySourceFilter').val(energySourceFilter.join(','))
    }

    //Reef type
    if($('#filter_reef_type_massive').prop("checked") == true)
    {
        reefTypeFilter.push("Massive");
    }
    if($('#filter_reef_type_narrow').prop("checked") == true)
    {
        reefTypeFilter.push("Narrow");
    }
    if (reefTypeFilter.length > 0) {
        $('#reefTypeFilter').val(reefTypeFilter.join(','))
    }
    // $('#filterForm').submit()
}
const handleApplyFilters = () =>{
    $('#filterForm').submit()
}
function OtherFunction(){
    // $('#search').val("XXXXXXXXXX");
    // $('newSearchForm').submit();

}
function handleSuggestionClick(val,id){
    let word = document.getElementById("search-form-widget").value;
    let commas = word.split(",");
    if(commas.length > 1){
        let t = ""
        for(let i = 0; i < commas.length - 1; i = i + 1){
            t = t + commas[i] + ",";
        }
        t = t + val
        let temp = document.getElementById("searchNext")
        temp.value = t
        let tempTwo = document.getElementById("search-form-widget");
        tempTwo.value = t;
        tempTwo.focus()
    }
    else{
        let temp = document.getElementById("searchNext")
        temp.value = val
        let tempTwo = document.getElementById("search-form-widget");
        tempTwo.value = val
        tempTwo.focus()    
        //   let temp = document.getElementById("searchList"); 
        // document.removeEventListener("click", handleMouseDown)
        //   temp.parentNode.removeChild(temp);
    }
    document.getElementById("newSearchForm").submit()
}
var searchbox = document.getElementById("search-form-widget");
if(searchbox)
{
    searchbox.addEventListener("keydown", function (e) {
        if (e.code === "Enter" || e.code === "NumpadEnter") {  //checks whether the pressed key is "Enter"
            if(location.pathname=="/"){
                window.location.href=window.location.origin+"/equipment/home/search?search="+searchbox.value;
            }
            else if(document.getElementById("search-form-widget").value.length>=2)
                {submitFinalSearch();}
        }
        else if(e.code ==="ArrowDown")
        {
    
        }
        else if(e.code ==="ArrowUp")
        {
            
        }
    });
}

const submitFinalSearch = () =>{
    document.getElementById("searchNext").value=document.getElementById("search-form-widget").value;
    document.getElementById("newSearchForm").submit();

}
const defineClickSensor = () =>{
    document.addEventListener("click", handleMouseDown)
}
const handleMouseDown = (evt) =>{
    let flyoutEl = document.getElementById('searchList'),
      targetEl = evt.target; // clicked element 
      if(targetEl == flyoutEl){
      } else{
          let temp = document.getElementById("searchList"); 
          if(temp){temp.parentNode.removeChild(temp);}
      }
}
function handleSearchChange(val){
    let word = val.value.split(",");
    let useWord = ""
    if(val.value.slice(-1) == ","){        
        let temp = document.getElementById("searchList"); 
        temp.parentNode.removeChild(temp);
    }
    //console.log(val.value.slice(-1));
    if(word.length > 1){
       useWord =  word[word.length - 1]
    }else{
        useWord = val.value
    }
    //console.log("CHECK WORD", useWord);
    if(!useWord)return
    $.get("/equipment/partial/search",{
        name: useWord
    }).then((data)=>{
    if(data.status === "Success"){       
        let temp = document.querySelector("#searchWrapper");
        const elements = document.getElementsByClassName("suggestion-wrapper");        
        while(elements.length > 0){
             elements[0].parentNode.removeChild(elements[0]);
        }
        let ul = document.createElement("ul");
        ul.id = "searchList"
        ul.className = "suggestion-wrapper";              
        for(let i = 0 ; i < data.message.length; i = i + 1){
            let innerTemp = document.createElement('li');
            innerTemp.innerHTML = data.message[i].split("##")[1]
            innerTemp.id = "iih" + data.message[i].split("##")[1]
            innerTemp.onclick = ()=>{ 
                //handleSuggestionClick(data.message[i].split("##")[1],data.message[i].split("##")[0])
                window.location.href= window.location.origin + "/equipment/"+data.message[i].split("##")[0];
            }
            ul.appendChild(innerTemp);
        }
        defineClickSensor()
        temp.appendChild(ul);
    }

    }).catch(err =>{
        
console.error("Error", err);
    })
    // $('#nameSearch').val(val.value)
    // $('#searchForm').submit()

}
function submitSearch(){
    // let searchTerms = $('#search-form-widget').val();
    // $('#name').val(searchTerms)
    
    // $('#searchForm').submit()
    // console.log("search", searchTerms);

}
// Remeber filter selections
function submitFilterTerms(element) {
    arrayOfFilters = [];

    let miningCycle = $('#miningCycle option:selected').text();
    arrayOfFilters.push(miningCycle);
    let miningCycleIndex = $('#miningCycle').prop('selectedIndex');
    sessionStorage.setItem('miningCycle', miningCycleIndex);

    let mineActivity = $('#mineActivity option:selected').text();
    arrayOfFilters.push(mineActivity);
    let mineActivityIndex = $('#mineActivity').prop('selectedIndex');
    sessionStorage.setItem('mineActivity', mineActivityIndex);

    let miningMethod = $('#miningMethod option:selected').text();
    arrayOfFilters.push(miningMethod);
    let miningMethodIndex = $('#miningMethod').prop('selectedIndex');
    sessionStorage.setItem('miningMethod', miningMethodIndex);

    let mineral = $('#mineral option:selected').text();
    arrayOfFilters.push(mineral);
    let mineralIndex = $('#mineral').prop('selectedIndex');
    sessionStorage.setItem('mineral', mineralIndex);


    let energySource = $('#energySource option:selected').text();
    arrayOfFilters.push(mineral);
    let energySourceIndex = $('#energySource').prop('selectedIndex');
    sessionStorage.setItem('energySource', energySourceIndex);

    let LogisticsAndMaterials = $('#LogisticsAndMaterials option:selected').text();
    arrayOfFilters.push(mineral);
    let LogisticsAndMaterialsIndex = $('#LogisticsAndMaterials').prop('selectedIndex');
    sessionStorage.setItem('LogisticsAndMaterials', LogisticsAndMaterialsIndex);

    let ITComms = $('#ITComms option:selected').text();
    arrayOfFilters.push(mineral);
    let ITCommsIndex = $('#ITComms').prop('selectedIndex');
    sessionStorage.setItem('ITComms', ITCommsIndex);

    let reefType = $('#reefType option:selected').text();
    arrayOfFilters.push(mineral);
    let reefTypeIndex = $('#reefType').prop('selectedIndex');
    sessionStorage.setItem('reefType', reefTypeIndex);


    $('#filterParams').val(arrayOfFilters.join());

}

function submitGraphicalFilterTerms(element) {
    let miningOperationsTerms = ['miningCycle', 'mineActivity', 'miningMethod', 'mineral'];
    let miningCycles = ['Mine Development', 'Access Development', 'Stoping', 'Logistics'];
    let mineActivities = ['Drilling', 'Blasting', 'Cleaning', 'Supporting', 'Services'];

    if (sessionStorage.getItem(miningOperationsTerms[0])) {
        sessionStorage.removeItem(miningOperationsTerms[0]);
    }

    if (sessionStorage.getItem(miningOperationsTerms[1])) {
        sessionStorage.removeItem(miningOperationsTerms[1]);
    }

    let filterTerms = $(element).closest('form').find('input').attr('value');

    let filterFieldsArray = filterTerms.split(',').map(item => item.trim());

    let miningCycleIndex = miningCycles.indexOf(filterFieldsArray[0]) + 1; // +1 because 'None' selection is index 0

    let mineActivityIndex = mineActivities.indexOf(filterFieldsArray[1]) + 1; // +1 because 'None' selection is index 0

    sessionStorage.setItem(miningOperationsTerms[0], miningCycleIndex);
    sessionStorage.setItem(miningOperationsTerms[1], mineActivityIndex);
}

// On page load, restore filters from session memory
$(function () {
    if (sessionStorage.getItem('miningCycle'))
        $('#miningCycle').prop('selectedIndex', JSON.parse(sessionStorage.getItem('miningCycle')));

    if (sessionStorage.getItem('mineActivity'))
        $('#mineActivity').prop('selectedIndex', JSON.parse(sessionStorage.getItem('mineActivity')));

    if (sessionStorage.getItem('miningMethod'))
        $('#miningMethod').prop('selectedIndex', JSON.parse(sessionStorage.getItem('miningMethod')));

    if (sessionStorage.getItem('mineral'))
        $('#mineral').prop('selectedIndex', JSON.parse(sessionStorage.getItem('mineral')));

    if (sessionStorage.getItem('energySource')){
        $('#energySource').prop('selectedIndex', JSON.parse(sessionStorage.getItem('energySource')));
    }  
    if (sessionStorage.getItem('LogisticsAndMaterials')){
        $('#LogisticsAndMaterials').prop('selectedIndex', JSON.parse(sessionStorage.getItem('LogisticsAndMaterials')));
    }    
    if (sessionStorage.getItem('LogisticsAndMaterials')){
        $('#LogisticsAndMaterials').prop('selectedIndex', JSON.parse(sessionStorage.getItem('LogisticsAndMaterials')));
    }    
    if (sessionStorage.getItem('LogisticsAndMaterials')){
        $('#LogisticsAndMaterials').prop('selectedIndex', JSON.parse(sessionStorage.getItem('LogisticsAndMaterials')));
    }    
})

$(function () {
    $('[data-toggle="popover"]').popover({
        html: true,
        trigger: 'hover',
        placement: 'bottom',
        container: 'body',
        content: function () { return '<img src="' + $(this).data('img') + '" />'; }
    });
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('/');
}

function goBack() {
    window.history.back();
}

//handle loader modal
const handleLoaderUser = (type) =>{
    if(type){
        document.getElementById("user-loading-modal-wrapper").style.display ="flex"

    }else{
        
    document.getElementById("user-loading-modal-wrapper").style.display ="none"
    }

}

//User page modal
let rejectId = ""
const openUsersModal = (id) =>{
    let temp = document.getElementById("custom-users-modal-wrapper")
    temp.style.display = "flex"
    rejectId = id
    //console.log("IDDDDDDDDDDD",id.substring(1));
}
const closeModal = () =>{
    let temp = document.getElementById("custom-users-modal-wrapper")
    temp.style.display = "none"
    rejectId = "";

}
const openDeleteModal = (id) =>{
    let temp = document.getElementById(id)
    temp.style.display = "flex"
}
const closeDeleteModal = (id) =>{
    let temp = document.getElementById(id)
    temp.style.display = "none"

}
const handleReject = () =>{
    let text = $(`#user-reject-reason`).val();
    handleUserApproval(rejectId, "rejected", text);
    $(`#user-reject-reason`).val('')
    closeModal()
    rejectId = "";
}



const handleUserApproval =async (data, status, reason ="") =>{
    handleLoaderUser(true)
    let id = data;

 $.ajax({
     url: `/users/approve/user?id=${id}&status=${status}&reason=${reason}`,
     type: "PUT",
    success: (res) =>{
        // let 
        let tempEle = document.getElementById(`status${id}`) 
        //console.log("CHANGED",tempEle);
        tempEle.innerHTML = status.toUpperCase()
        if(status === "approved"){
            document.getElementById(`app${id}`).className ="button_disabled";
            document.getElementById(`rej${id}`).className ="";

        }else{
            document.getElementById(`app${id}`).className ="";
            document.getElementById(`rej${id}`).className ="button_disabled";
        }
 
    handleLoaderUser(false);
    },
    error: (err) =>{
        console.error("ERROR ", err);
        handleLoaderUser(false);
    }
 })

}

const handleUserDelete = (id) =>{

    handleLoaderUser(true)
    $.ajax({
        url: `/users/${id}`,
        type:"DELETE",
        success : () =>{
            $(`#row${id}`).remove();
            handleLoaderUser(false)

        },
        error : () =>{
            handleLoaderUser(false)
            alert("Delete Unsuccessful")

        },

    })
}
const decideButtonDisability = (obj) =>{
    // console.log("DATA", obj);
    return false

}

//Equipment Table

const handleEquipmentApproval = async(id, status, reason ="") =>{
    handleLoaderUser(true)

 $.ajax({
     url: `/equipment/approve/equipment?id=${id}&status=${status}&reason=${reason}`,
     type: "PUT",
    success: (res) =>{
        // let 
        let tempEle = document.getElementById(`status${id}`) 
        //console.log("CHANGED",tempEle);
        tempEle.innerHTML = status.toUpperCase();
        if(status === "approved"){
            document.getElementById(`app${id}`).className ="button_disabled";
            document.getElementById(`rej${id}`).className ="";

        }else{
            document.getElementById(`app${id}`).className ="";
            document.getElementById(`rej${id}`).className ="button_disabled";
        }
 
    handleLoaderUser(false)
    },
    error: (err) =>{
        console.error("ERROR ", err);
        handleLoaderUser(false);
    }
 })

}
let rejectIdEquip = ""
const openEquipModal = (id) =>{
    let temp = document.getElementById("custom-equip-modal-wrapper")
    temp.style.display = "flex"
    rejectIdEquip = id

}
const closeModalEquip = () =>{
    let temp = document.getElementById("custom-equip-modal-wrapper")
    temp.style.display = "none"
    rejectIdEquip = "";

}
const handleRejectEquip = () =>{
    let text = $(`#equip-reject-reason`).val();
    handleEquipmentApproval(rejectIdEquip, "rejected", text);
    $(`#equip-reject-reason`).val('')
    closeModalEquip()
    rejectIdEquip = "";
}
const handleEquipDelete = (id) =>{
    handleLoaderUser(true)
    $.ajax({
        url: `/equipment/${id}`,
        type:"DELETE",
        success : () =>{
            $(`#row${id}`).remove();
            handleLoaderUser(false)

        },
        error : () =>{
            handleLoaderUser(false)
            alert("Delete Unsuccessful")

        },

    })
}
//landing
const  checkWithValue= (val) => {
    $(":checkbox").filter(function() {
        return this.value ==  htmlDecode(val);
    }).prop("checked", "true");
}
function htmlEncode(value) {
    return $('<div/>').text(value).html();
}
 
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}
const addClassToWrapper = (type) =>{
    if(type){
        document.getElementById("isotop-wrapper-id")?.classList.add("only-six")
    }else{
        document.getElementById("isotop-wrapper-id")?.classList.remove("only-six")

    }

}
window.onload = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString); 
    var x = document.querySelectorAll(".htmldecode");
        for (var i = 0; i < x.length; i++) {
            x[i].innerHTML = htmlDecode(x[i].innerHTML);
        }
    if(window.location.href.includes("equipment/home/search")){
        let searchString=urlParams.get('search');
        let searchbox=document.getElementById("search-form-widget");
        if(searchbox)
        {
            searchbox.value=searchString;
        }
        return;
    }    
    if(window.location.href.endsWith("/edit") && !window.location.href.includes("/users/"))
    {
        $("#mineActivity input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#miningCycle input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#mineActivity input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#miningMethod input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#mineral input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#energySource input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#LogisticsAndMaterials input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#ITComms input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });
        $("#reefType input:text").val().split(",").forEach(element => {
            checkWithValue(element);
        });        
        $("#ddltrl").val($("#txttrl").val());
    }
    if(window.location.href.includes('/news/add') || window.location.href.includes('/news/edit'))
    {
        invokeNewsMethods();
    }
    //console.log(urlParams);
    if(urlParams.size>1)
    {
        $('a[href^="/equipment?pageNumber"]').each(function( index ) {        
            //console.log($(this).attr('href'));
            $(this).attr('href',$(this).attr('href')+'&'+location.search.substring(1));
          });
    }
    if($('#userType'))
    {
        let usert=$('select[name=userType]').find(":selected").val();
        if(usert == 'memsa')
        {
            $('#divmemsa').show();
            //$('#divcompany').show();
            //$("#companyReg").prop('required',true);
            //$("#vatNumber").prop('required',true);
            $("#mesmaId").prop('required',true);
        }
        else
        {
            $('#divmemsa').hide();
            //$('#divcompany').hide();
           // $("#companyReg").prop('required',false);
           // $("#vatNumber").prop('required',false);
            $("#mesmaId").prop('required',false);
        }
    }  
    const _miningMethod = urlParams.get('miningMethod')        
    const _mineral = urlParams.get('mineral')
    const _miningActivity = urlParams.get('miningActivity')
    const _miningCycle = urlParams.get('miningCycle')
    const _miningType = urlParams.get('miningType')
    const _energySource = urlParams.get('energySource')
    const _LogisticsAndMaterials = urlParams.get('LogisticsAndMaterials')
    const _ITComms = urlParams.get('ITComms')
    const _reefType = urlParams.get('reefType')

    $('#_miningMethod').height('0px');                    
    $('#_mineral').height('0px');
    $('#_miningActivity').height('0px');
    $('#_miningCycle').height('0px');
    $('#_miningType').height('0px');
    $('#_energySource').height('0px');
    $('#_LogisticsAndMaterials').height('0px');
    $('#_ITComms').height('0px');
    $('#_reefType').height('0px');
    let filter=false;
    if(_miningMethod &&_miningMethod.length>0)    {$('#_miningMethod').height('auto');filter=true;}
    if(_mineral && _mineral.length>0)    {$('#_mineral').height('auto');filter=true;}
    if(_miningActivity && _miningActivity.length>0)    {$('#_miningActivity').height('auto');filter=true;}
    if(_miningCycle &&  _miningCycle.length>0)    {$('#_miningCycle').height('auto');filter=true;}
    if(_miningType && _miningType.length>0)    {$('#_miningType').height('auto');filter=true;}
    if(_energySource && _energySource.length>0)    {$('#_energySource').height('auto');filter=true;}
    if(_LogisticsAndMaterials && _LogisticsAndMaterials.length>0)    {filter=true;$('#_LogisticsAndMaterials').height('auto');}
    if(_ITComms && _ITComms.length>0)    {$('#_ITComms').height('auto');filter=true;}
    if(_reefType && _reefType.length>0)    {$('#_reefType').height('auto');filter=true;}
    if(document.referrer == window.location.origin && filter){
        onChangeFilterChecks();
        handleApplyFilters();
    }     
}    
$('#userType').on('change', function() {    
    if(this.value == 'memsa')
    {
        $('#divmemsa').show();
        //$('#divcompany').show();
        //$("#companyReg").prop('required',true);
        //$("#vatNumber").prop('required',true);
        $("#mesmaId").prop('required',true);
    }
    else
    {
        $('#divmemsa').hide();
        //$('#divcompany').hide();
        //$("#companyReg").prop('required',false);
       // $("#vatNumber").prop('required',false);
        $("#mesmaId").prop('required',false);
    }
  });
  function concatenateStringsWithoutDuplicates(inputstring,outputstring) {    
    const uniqueStrings = (outputstring + ',' + inputstring).split(",").map(item=>item.trim());    
    const arrayOfStrings = uniqueStrings.filter((item,index) => uniqueStrings.indexOf(item) === index);;    
    const concatenatedString = arrayOfStrings.join(",");      
    return concatenatedString.replace(/^,+|,+$/g, '');;
  }   
  function removecontent(todelete,source)
  {
    const uniqueStrings = (source).split(",").map(item=>item.trim());
    const index =   uniqueStrings.indexOf(todelete);
    if (index > -1) { // only splice array when item is found
        uniqueStrings.splice(index, 1); // 2nd parameter means remove one item only
    }    
    return uniqueStrings.join(",").replace(/^,+|,+$/g, '');;
  }
 $('#miningType').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#miningType input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#miningType input:text").val()));
    } else {
        $("#miningType input:text").val(removecontent($(this).val(),$("#miningType input:text").val()));
    }
 });
 $('#miningCycle').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#miningCycle input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#miningCycle input:text").val()));
    } else {
        $("#miningCycle input:text").val(removecontent($(this).val(),$("#miningCycle input:text").val()));
    }
 });
 $('#mineActivity').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#mineActivity input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#mineActivity input:text").val()));
    } else {
        $("#mineActivity input:text").val(removecontent($(this).val(),$("#mineActivity input:text").val()));
    }
 });
 $('#miningMethod').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#miningMethod input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#miningMethod input:text").val()));
    } else {
        $("#miningMethod input:text").val(removecontent($(this).val(),$("#miningMethod input:text").val()));
    }
 });
 $('#mineral').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#mineral input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#mineral input:text").val()));
    } else {
        $("#mineral input:text").val(removecontent($(this).val(),$("#mineral input:text").val()));
    }
 });
 $('#energySource').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#energySource input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#energySource input:text").val()));
    } else {
        $("#energySource input:text").val(removecontent($(this).val(),$("#energySource input:text").val()));
    }
 });
 $('#LogisticsAndMaterials').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#LogisticsAndMaterials input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#LogisticsAndMaterials input:text").val()));
    } else {
        $("#LogisticsAndMaterials input:text").val(removecontent($(this).val(),$("#LogisticsAndMaterials input:text").val()));
    }
 });
 $('#ITComms').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#ITComms input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#ITComms input:text").val()));
    } else {
        $("#ITComms input:text").val(removecontent($(this).val(),$("#ITComms input:text").val()));
    }
 });
 $('#reefType').on("change", ":checkbox", function() {
    if($(this).is(':checked')){
       $("#reefType input:text").val(concatenateStringsWithoutDuplicates($(this).val(),$("#reefType input:text").val()));
    } else {
        $("#reefType input:text").val(removecontent($(this).val(),$("#reefType input:text").val()));
    }
 });

 const invokeNewsMethods = () => {
    $('.txtnewscontent').richText();
    $('.etxtnewscontent').richText();
    $('.richText-help').hide();  
 }
const saveNews =() =>{
    var data = $('.richText-editor').html();
    var encData=htmlEncode(data);    
    var postdata={
        newsTitle:$("#newsTitle").val(),
        newsContent: encData ,
        createdBy:'',
        createdOn:'',
        editedBy:'',
        editedOn:''
    };
    $.post("add",  postdata,
             function(data, status)
             {
                alert(data.message);
                window.location.href = window.location.origin + "/news";
            }
        );
    return false;
}
const deleteNewsItem = (id) =>{
    if(confirm("Are you sure want to delete this news item? it will not revert back."))
    {
        var postdata={     
            id:id           
        };
        $.post("news/delete",  postdata,
            function(data, status)
            {
                alert(data.message);
                window.location.href = window.location.origin + "/news";
            }
        );
    }    
}

const editNewsItem = (id) =>{
    window.location.href=window.location.origin+"/news/edit?id="+id;
}

const saveEditNews = () =>{
    var data = htmlEncode($('.richText-editor').html());      
    var postdata={     
        id:$('#newsid').val(),   
        newsTitle:$("#newsTitle").val(),
        newsContent: data
    };
    $.post("edit",  postdata,
             function(data, status)   
             {
                //alert("\nStatus: " + status);  
                alert(data.message);
                window.location.href = window.location.origin + "/news";
            }
        );
    return false;
}
const gotonewsitems = () => {
    window.location.href = window.location.origin + "/news";
}
const gotoAddNews = () => {
    window.location.href = window.location.origin + "/news/add";
}
$('.content').each(function( index ) {1
    var html=htmlDecode(htmlDecode($(this).html()));
    $(this).html(html);
});

const ShowContentView = (id) => {
    var content= $('#'+id).val();
    var title=$('#title'+id).html();
    var html=htmlDecode(content)
    $('#newsTitle').html(title);
    $('#divviewContent').html(html);
    $('#idViewNews').modal('show')
}