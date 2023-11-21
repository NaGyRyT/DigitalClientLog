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
    return listToSort.sort((a,b) => {
        const aa = typeof(a[sortedColumn]) === 'string' ? a[sortedColumn].toLowerCase() : a[sortedColumn];
        const bb = typeof(b[sortedColumn]) === 'string' ? b[sortedColumn].toLowerCase() : b[sortedColumn];
        return (aa > bb ) ? 1 : ((bb > aa) ? -1 : 0)
    });
}

export function orderDescend(listToSort, sortedColumn) {
    return listToSort.sort((a,b) => {
        const aa = typeof(a[sortedColumn]) === 'string' ? a[sortedColumn].toLowerCase() : a[sortedColumn];
        const bb = typeof(b[sortedColumn]) === 'string' ? b[sortedColumn].toLowerCase() : b[sortedColumn];
        return (aa < bb ) ? 1 : ((bb < aa) ? -1 : 0)
    });
}