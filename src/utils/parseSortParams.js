function parseSortBy(value){
    if(typeof value === "undefined"){
        return "name";
    }

    const keys = ["name", "phoneNumber", "email"];
    if(!keys.includes(value)) {
        return "name";
    }
    return value;
}

function parseSortOrder(value) {
    if(typeof value === "undefined"){
        return "asc";
    }

    if( value != "asc" && value != "desc" ){
        return "asc";
    }
    return value;
}

export function parseSortParams(query) {
    const { sortBy, sortOrder } = query;

    const parsedSortBy = parseSortBy(sortBy); 
    const parsedSortOrder= parseSortOrder(sortOrder);

    return{
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder 
    };
}