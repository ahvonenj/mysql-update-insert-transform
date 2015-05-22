function MysqlTransformer()
{
	this.storedTableName = '';
}

//Update query to insert query transform
MysqlTransformer.prototype.UpdateToInsert = function (sql, outputselector, ajaxoutputselector, functionoutputselector, radiogroupselector, onerrorcallback)
{
    if (typeof sql === 'undefined' || sql.length < 20)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Update query cannot possibly be this short');

        return;
    }

    if (!this.isValidUpdate(sql))
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Update query does not seem to be valid');

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
	
	this.storedTableName = tableName;

    //Check that column and value counts match
    if (splitSetlist.columns.length !== splitSetlist.values.length)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Column and value count does not match or the query is badly structured');

        return;
    }

	var ajaxdatastring = '';
	var issetstring = 'if(isset(';
	var bindstring = '';
	var parameterstring = 'function someFunction(';
	var functionstring = '';
	
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
			columnorvalue = (columnorvalue.length > 0) ? columnorvalue : null;
            transformed_values += columnorvalue + comma + lb;
        }
    }

    transformed += ')\n' + transformed_values + ');';
	
	var requesttype = $(radiogroupselector + ' input[type=radio]:checked').val();
	
	for(var i = 0; i < splitSetlist.columns.length; i++)
	{
		var comma = (i == splitSetlist.columns.length - 1) ? '' : ',';
		var comma2 = (i == splitSetlist.columns.length - 1) ? '' : ', ';
		var lb = (i == splitSetlist.columns.length - 1) ? '' : '\n';
		var column = splitSetlist.columns[i];
		var value = splitSetlist.values[i];
		
		ajaxdatastring += '\t\t' + column + ': ' + value + '' + comma + '\n';
		issetstring += '$_' + requesttype + '["' + column + '"]' + comma2;
		bindstring += '$query->bindValue("' + column + '", ' + value + ');' + lb;
		parameterstring += '$' + column + comma2;
	}
	
	var ajaxstring = '$.ajax(\n{\n\ttype: "type",\n\turl: "url",\n\tdata:\n\t{\n' + ajaxdatastring + '\t}\n});';
	
	issetstring += '))\n{\n\t\n}';
	parameterstring += ')\n{\n\t\n}';
	
	functionstring += issetstring + '\n\n\n' + bindstring + '\n\n\n' + parameterstring;

    //Output transformed query
    $(outputselector).val(transformed);
	$(ajaxoutputselector).val(ajaxstring);
	$(functionoutputselector).val(functionstring);
};

//Insert query to update query transform
MysqlTransformer.prototype.InsertToUpdate = function (sql, outputselector, ajaxoutputselector, functionoutputselector, radiogroupselector, onerrorcallback)
{
    if (typeof sql === 'undefined' || sql.length < 20)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Insert query cannot possibly be this short');

        return;
    }

    if (!this.isValidInsert(sql))
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Insert query does not seem to be valid');

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

	this.storedTableName = tableName;
	
    //Check that column and value counts match
    if (columnList.length !== valueList.length)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Column and value count does not match or the query is badly structured');

        return;
    }

	var ajaxdatastring = '';
	var issetstring = 'if(isset(';
	var bindstring = '';
	var parameterstring = 'function someFunction(';
	var functionstring = '';
	
	var requesttype = $(radiogroupselector + ' input[type=radio]:checked').val();
	
    //Make the transform string
    transformed += tableName + '\nSET\n';

    for (var i = 0; i < columnList.length; i++)
    {
        var column = (columnList[i].length > 0) ? columnList[i] : null;
        var value = (valueList[i].length > 0) ? valueList[i] : null;
        var comma = (i == columnList.length - 1) ? '' : ',';
		var comma2 = (i == columnList.length - 1) ? '' : ', ';
		var lb = (i == columnList.length - 1) ? '' : '\n';

        transformed += '`' + column + '` = ' + value + comma + '\n';
		ajaxdatastring += '\t\t' + column + ': ' + value + '' + comma + '\n';
		issetstring += '$_' + requesttype + '["' + column + '"]' + comma2;
		bindstring += '$query->bindValue("' + column + '", ' + value + ');' + lb;
		parameterstring += '$' + column + comma2;
    }

    transformed += 'WHERE `someid` = :somevalue;';
	
	var ajaxstring = '$.ajax(\n{\n\ttype: "type",\n\turl: "url",\n\tdata:\n\t{\n' + ajaxdatastring + '\t}\n});';
	
	issetstring += '))\n{\n\t\n}';
	parameterstring += ')\n{\n\t\n}';
	
	functionstring += issetstring + '\n\n\n' + bindstring + '\n\n\n' + parameterstring;

    //Output transformed query
    $(outputselector).val(transformed);
	$(ajaxoutputselector).val(ajaxstring);
	$(functionoutputselector).val(functionstring);
};

//Jquery-like ajax call to SQL transform
MysqlTransformer.prototype.AjaxToSQL = function (ajaxstring, outputselector1, outputselector2, functionoutputselector, radiogroupselector, onerrorcallback)
{
	if (typeof ajaxstring === 'undefined' || ajaxstring.length < 10)
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Ajax call cannot possibly be this short');

        return;
    }

    if (!this.isValidAjax(ajaxstring))
    {
        if (typeof onerrorcallback !== 'undefined')
            onerrorcallback('Ajax call does not seem to be valid');

        return;
    }

	var parsedajax = this.ajaxToJSON(ajaxstring);
	
	console.log(parsedajax);
	
	var tableName = (this.storedTableName !== '') ? this.storedTableName : '`somedb`.`sometable`';
	
	var insertTransform = 'INSERT INTO ' + tableName + '\n(';
	var insertValues = 'VALUES\n(';
	var updateTransform = 'UPDATE ' + tableName + '\nSET\n';
	var issetstring = 'if(isset(';
	var bindstring = '';
	var parameterstring = 'function someFunction(';
	var functionstring = '';
	
	var requesttype = $(radiogroupselector + ' input[type=radio]:checked').val();
	
	if(typeof parsedajax !== 'undefined')
	{
		if(parsedajax.keys.length === parsedajax.values.length)
		{
			for(var i = 0; i < parsedajax.keys.length; i++)
			{
				var key = (parsedajax.keys[i].length > 0) ? parsedajax.keys[i] : null;
				var value = (parsedajax.values[i].length > 0) ? parsedajax.values[i] : null;
				var comma = (i == parsedajax.keys.length - 1) ? '' : ',';
				var comma2 = (i == parsedajax.keys.length - 1) ? '' : ', ';
				var lb = (i == parsedajax.keys.length - 1) ? '' : '\n';
				
				insertTransform += '`' + key + '`' + comma + lb;
				insertValues += value + comma + lb;
				updateTransform += '`' + key + '` = ' + value + comma + '\n';
				
				issetstring += '$_' + requesttype + '["' + key + '"]' + comma2;
				bindstring += '$query->bindValue("' + key + '", ' + value + ');' + lb;
				parameterstring += '$' + key + comma2;
			}
			
			insertTransform += ')\n' + insertValues + ');';
			updateTransform += 'WHERE `someid` = :somevalue;';
			
			issetstring += '))\n{\n\t\n}';
			parameterstring += ')\n{\n\t\n}';
			
			functionstring += issetstring + '\n\n\n' + bindstring + '\n\n\n' + parameterstring;
			
			$(outputselector1).val(updateTransform);
			$(outputselector2).val(insertTransform);
			$(functionoutputselector).val(functionstring);
		}
		else
		{
			if (typeof onerrorcallback !== 'undefined')
				onerrorcallback('Column and value count does not match or the ajax call is badly structured');
				
			return;
		}
	}
	else
	{
		if (typeof onerrorcallback !== 'undefined')
			onerrorcallback('Ajax call could not be parsed');
			
		return;
	}
};

//Helper to remove tabs and newlines from a string
MysqlTransformer.prototype.rt = function (str)
{
    return str.replace(/(\r\n|\n|\r|\t)/gm, '').replace(' ', '');
};

//"Hack" to convert a column list in a string form into a JavaScript array
MysqlTransformer.prototype.columnListStringToArray = function (str)
{
    var returnarray = str.replace("(", "").replace(")", "").replace(/\`/g, "").replace(/\'/g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "").split(',');
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

//"Hack to convert jquery-like ajax call to JSON
MysqlTransformer.prototype.ajaxToJSON = function(ajaxstr)
{
	var stripped = ajaxstr.replace('$.ajax(', '').replace(');', '').replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "");
	stripped = stripped.substring(stripped.indexOf('data:{') + 6, stripped.indexOf('}', stripped.indexOf('data:{'))).split(',');
	
	var returnlists = 
	{
		keys: [],
		values: []
	}
	
	for(var i = 0; i < stripped.length; i++)
	{
		if((stripped[i].match(/is/g) || []).length === 1)
		{
			var split = stripped[i].split(':');
		}
		else
		{
			var firstIdx = stripped[i].indexOf(':');
			var first = stripped[i].substring(0, firstIdx);
			var rest = stripped[i].substr(firstIdx + 1);
			var glued = first + ':' + rest;
			
			console.log(first, rest, glued);
			
			var split = [];
			split[0] = first;
			split[1] = rest;
		}
		
		returnlists.keys.push(split[0]);
		returnlists.values.push(split[1]);
	}
	
	return returnlists;
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

//Check if the given querystring is somewhat valid insert query
MysqlTransformer.prototype.isValidInsert = function (querystring)
{
    if (querystring.indexOf('INSERT INTO') > -1 &&
        querystring.indexOf('VALUES') > -1)
    {
        return true;
    }
    else
    {
        return false;
    }
};

//Check if the given querystring is somewhat valid update query
MysqlTransformer.prototype.isValidUpdate = function (querystring)
{
    if (querystring.indexOf('UPDATE') > -1 &&
        querystring.indexOf('SET') > -1 &&
        querystring.indexOf('WHERE') > -1)
    {
        return true;
    }
    else
    {
        return false;
    }
};

//Check if the given ajaxstring is somewhat valid ajax call
MysqlTransformer.prototype.isValidAjax = function (ajaxstring)
{
    if (ajaxstring.indexOf('$.ajax') > -1 &&
        ajaxstring.indexOf('data:') > -1)
    {
        return true;
    }
    else
    {
        return false;
    }
};