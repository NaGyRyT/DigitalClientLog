export function handleSort (listToSort, sortDirection, sortedColumn, tableName, needToChangeOrderDirection = true) {
    let sortedList
    if (sortDirection === 'asc' && needToChangeOrderDirection) {
        sortedList = orderAscend(listToSort, sortedColumn);
        sortDirection ='des';
    } else if (sortDirection === 'des' && needToChangeOrderDirection) {
        sortedList = orderDescend(listToSort, sortedColumn);
        sortDirection ='asc';
    } else if (sortDirection === 'asc' && !needToChangeOrderDirection) {
        sortedList = orderDescend(listToSort, sortedColumn);
    } else if (sortDirection === 'des' && !needToChangeOrderDirection) {
        sortedList = orderAscend(listToSort, sortedColumn);
    }
    sessionStorage.setItem(tableName + 'TableSortedColumnName', sortedColumn);
    if (needToChangeOrderDirection) sessionStorage.setItem(tableName + 'TableSortDirection', sortDirection);
    return sortedList
}

export function orderAscend(listToSort, sortedColumn) {
    return listToSort.sort((a,b) =>
        (a[sortedColumn].toString().toString().toLowerCase() > b[sortedColumn].toString().toLowerCase()) ? 1 :
        ((b[sortedColumn].toString().toLowerCase() > a[sortedColumn].toString().toLowerCase()) ? -1 : 0)
    );
}

export function orderDescend(listToSort, sortedColumn) {
    return listToSort.sort((a,b) => (
        a[sortedColumn].toString().toLowerCase() < b[sortedColumn].toString().toLowerCase()) ? 1 : 
        ((b[sortedColumn].toString().toLowerCase() < a[sortedColumn].toString().toLowerCase()) ? -1 : 0)
    );
}