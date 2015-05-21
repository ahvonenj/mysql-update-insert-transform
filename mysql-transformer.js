function MysqlTransformer()
{

}

//Update query to insert query transform
MysqlTransformer.prototype.UpdateToInsert = function (sql, outputselector, onerrorcallback)
{
    if (typeof sql === 'undefined' || sql.length < 20)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Update query cannot possibly be this short');

        return;
    }

    var transformed = 'INSERT INTO '; //Returned, transformed query first part
    var transformed_values = 'VALUES\n('; //Returned, transformed query last part

    //Parse needed indexes from the query
    var updateStmtIdx = 7;
    var setStmtIdx = sql.indexOf('SET');
    var whereStmtIdx = sql.indexOf('WHERE');

    //Parse needed information for transform out of the query
    var tableName = this.rt(sql.substring(updateStmtIdx, setStmtIdx));
    var setlist = this.setlistStringToArray(this.rt(sql.substring(setStmtIdx + 3, whereStmtIdx)));

    var splitSetlist = this.splitSetlist(setlist);

    //Check that column and value counts match
    if (splitSetlist.columns.length !== splitSetlist.values.length)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Column and value count does not match');

        return;
    }

    //Make the transform string
    transformed += tableName + '\n(';

    for (var i = 0; i < setlist.length; i++)
    {
        var columnorvalue = setlist[i];
        var comma = (i == setlist.length - 2 || i == setlist.length - 1) ? '' : ',';
        var lb = (i == setlist.length - 2 || i == setlist.length - 1) ? '' : '\n';

        if (i == 0 || i % 2 == 0)
        {
            transformed += '`' + columnorvalue + '`' + comma + lb;
        }
        else
        {
            transformed_values += columnorvalue + comma + lb;
        }
    }

    transformed += ')\n' + transformed_values + ');';

    //Output transformed query
    $(outputselector).val(transformed);
};

//Insert query to update query transform
MysqlTransformer.prototype.InsertToUpdate = function (sql, outputselector, onerrorcallback)
{
    if (typeof sql === 'undefined' || sql.length < 20)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Insert query cannot possibly be this short');

        return;
    }

    var transformed = 'UPDATE '; //Returned, transformed query

    //Parse needed indexes from the query
    var insertStmtIdx = 11;
    var columnListIdx = sql.indexOf('(');
    var columnListLastIdx = sql.indexOf(')');
    var valuesStmtIdx = sql.indexOf('VALUES') + 6;
    var valueListIdx = sql.indexOf('(', valuesStmtIdx);
    var valueListLastIdx = sql.indexOf(')', valuesStmtIdx);

    //Parse needed information for transform out of the query
    var tableName = this.rt(sql.substring(insertStmtIdx, columnListIdx));
    var columnList = this.columnListStringToArray(this.rt(sql.substring(columnListIdx - 1, columnListLastIdx + 1)));
    var valueList = this.valueListStringToArray(this.rt(sql.substring(valueListIdx - 1, valueListLastIdx + 1)));

    //Check that column and value counts match
    if (columnList.length !== valueList.length)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Column and value count does not match');

        return;
    }

    //Make the transform string
    transformed += tableName + '\nSET\n';

    for (var i = 0; i < columnList.length; i++)
    {
        var column = columnList[i];
        var value = valueList[i];
        var comma = (i == columnList.length - 1) ? '' : ',';

        transformed += '`' + column + '` = ' + value + comma + '\n';
    }

    transformed += 'WHERE `someid` = :somevalue;';

    //Output transformed query
    $(outputselector).val(transformed);
};

//Helper to remove tabs and newlines from a string
MysqlTransformer.prototype.rt = function (str)
{
    return str.replace(/(\r\n|\n|\r|\t)/gm, '').replace(' ', '');
};

//"Hack" to convert a column list in a string form into a JavaScript array
MysqlTransformer.prototype.columnListStringToArray = function (str)
{
    str = str.replace("(", "[").replace(")", "]").replace(/\`/g, "\'");
    var returnarray = eval(str); //Eval array looking string into an actual array :)
    return returnarray;
};

//"Hack" to convert a value list in a string form into a JavaScript array
MysqlTransformer.prototype.valueListStringToArray = function (str)
{
    var returnarray = str.replace("(", "").replace(")", "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "").split(',');
    return returnarray;
};

//"Hack" to convert a set list in a string form into a JavaScript array
MysqlTransformer.prototype.setlistStringToArray = function (str)
{
    var returnarray = str.replace(/,/g, "=").replace(/\`/g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "").split('=');

    //Try to do some parsing so that numeric data is kept numeric
    for (var rar in returnarray)
    {
        var set = returnarray[rar];

        if (this.isNumeric(set))
        {
            set = parseInt(set);
        }
    }

    return returnarray;
};

//Helper function for numeric checking
MysqlTransformer.prototype.isNumeric = function (somevar)
{
    return !isNaN(somevar);
};

//Splits the setlist into columns and values. The setlist is first parsed into a single array where
//every other index is column and every other index a value, so we want to separate those into their own
//arrays
MysqlTransformer.prototype.splitSetlist = function (setlist)
{
    var lists = {
        columns: [],
        values: []
    };

    for (var i = 0; i < setlist.length; i++)
    {
        if (i == 0 || i % 2 == 0)
        {
            lists.columns.push(setlist[i]);
        }
        else
        {
            lists.values.push(setlist[i]);
        }
    }

    return lists;
};