import './paginationControls.html';

Template.paginationControls.events({
    'click .next-page'(){
        Template.instance().data.RV_pageNumber.set(Template.instance().data.RV_pageNumber.get()+1);
    },
    'click .previous-page'(){
        let pageNumber = Template.instance().data.RV_pageNumber.get();
        if(pageNumber>1)
            Template.instance().data.RV_pageNumber.set(pageNumber-1);
    },
})

Template.paginationControls.helpers({
    hasNext(){
        return true;
    },
    hasPrevious(){
        return true;
    },
})