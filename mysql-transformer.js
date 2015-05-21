function MysqlTransformer()
{

}

MysqlTransformer.prototype.UpdateToInsert = function (sql, outputselector, onerrorcallback)
{
    var transformed = 'UPDATE ';

    var insertStmtIdx = 11;
    var columnListIdx = sql.indexOf('(');
    var columnListLastIdx = sql.indexOf(')');
    var valuesStmtIdx = sql.indexOf('VALUES') + 6;
    var valueListIdx = sql.indexOf('(', valuesStmtIdx);
    var valueListLastIdx = sql.indexOf(')', valuesStmtIdx);

    var tableName = this.rt(sql.substring(insertStmtIdx, columnListIdx));
    var columnList = this.columnListStringToArray(this.rt(sql.substring(columnListIdx - 1, columnListLastIdx + 1)));
    var valueList = this.valueListStringToArray(this.rt(sql.substring(valueListIdx - 1, valueListLastIdx + 1)));

    if (columnList.length !== valueList.length)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Column and value count does not match');

        return;
    }

    transformed += tableName + '\nSET\n';

    for (var i = 0; i < columnList.length; i++)
    {
        var column = columnList[i];
        var value = valueList[i];
        var comma = (i == columnList.length - 1) ? '' : ',';

        transformed += '`' + column + '` = ' + value + comma + '\n';
    }

    transformed += 'WHERE `someid` = :somevalue;';

    $(outputselector).val(transformed);
};

MysqlTransformer.prototype.InsertToUpdate = function (sql, outputselector, onerrorcallback)
{
    var transformed = 'INSERT INTO ';
    var transformed_values = 'VALUES\n(';

    var updateStmtIdx = 7;
    var setStmtIdx = sql.indexOf('SET');
    var whereStmtIdx = sql.indexOf('WHERE');

    var tableName = this.rt(sql.substring(updateStmtIdx, setStmtIdx));
    var setlist = this.setlistStringToArray(this.rt(sql.substring(setStmtIdx + 3, whereStmtIdx)));

    var splitSetlist = this.splitSetlist(setlist);

    if (splitSetlist.columns.length !== splitSetlist.values.length)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Column and value count does not match');

        return;
    }

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

    $(outputselector).val(transformed);
};

MysqlTransformer.prototype.rt = function (str)
{
    return str.replace(/(\r\n|\n|\r|\t)/gm, '').replace(' ', '');
};

//Hack to convert a column list in a string form into a JavaScript array
MysqlTransformer.prototype.columnListStringToArray = function (str)
{
    str = str.replace("(", "[").replace(")", "]").replace(/\`/g, "\'");
    var returnarray = eval(str);
    return returnarray;
};

//Hack to convert a value list in a string form into a JavaScript array
MysqlTransformer.prototype.valueListStringToArray = function (str)
{
    var returnarray = str.replace("(", "").replace(")", "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "").split(',');
    return returnarray;
};

//Hack to convert a set list in a string form into a JavaScript array
MysqlTransformer.prototype.setlistStringToArray = function (str)
{
    var returnarray = str.replace(/,/g, "=").replace(/\`/g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "").split('=');

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

MysqlTransformer.prototype.isNumeric = function (somevar)
{
    return !isNaN(somevar);
};

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