var transformer;

$(document).ready(function ()
{
    transformer = new MysqlTransformer();

    $('#updatetoinsert').on('click', function ()
    {
        transformer.UpdateToInsert($('#updatearea').val(), '#insertarea', '#ajaxarea', function (errormsg)
        {
            alert(errormsg);
        });
		
		$('#urlfield').val(getUrl() + '?querytype=update&query=' + encodeURIComponent($('#updatearea').val()).replace(/%20/g,'+'));
    });

    $('#inserttoupdate').on('click', function ()
    {
        transformer.InsertToUpdate($('#insertarea').val(), '#updatearea', '#ajaxarea', function (errormsg)
        {
            alert(errormsg);
        });
		
		$('#urlfield').val(getUrl() + '?querytype=insert&query=' + encodeURIComponent($('#insertarea').val()).replace(/%20/g,'+'));
    });
	
	$('#ajaxtosql').on('click', function ()
    {
        transformer.AjaxToSQL($('#ajaxarea').val(), '#updatearea', '#insertarea', function (errormsg)
        {
            alert(errormsg);
        });
		
		//$('#urlfield').val(getUrl() + '?querytype=insert&query=' + encodeURIComponent($('#insertarea').val()).replace(/%20/g,'+'));
    });
	
	var linkedquery = getParameterByName('query');
	var linkedquerytype = getParameterByName('querytype');
	
	if(typeof linkedquery !== 'undefined' && linkedquery !== '' &&
	typeof linkedquerytype !== 'undefined' && linkedquerytype !== '')
	{
		if(linkedquerytype == 'insert')
		{
			$('#insertarea').val(linkedquery);
		}
		else if(linkedquerytype == 'update')
		{
			$('#updatearea').val(linkedquery);
		}
	}
	
	function getParameterByName(name)
	{
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
		
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	function getUrl()
	{
		return location.protocol + '//' + location.host + location.pathname;
	}
});