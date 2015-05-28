var transformer;

$(document).ready(function ()
{
    transformer = new MysqlTransformer();

    $('#updatetoinsert').on('click', function ()
    {
        console.log($('#flipajax').is(':checked'));
        transformer.UpdateToInsert($('#updatearea').val(), '#insertarea', '#ajaxarea', '#functionarea', '#radio_wrapper', $('#flipajax').is(':checked'), function (errormsg)
        {
            alert(errormsg);
        });
		
		$('#urlfield').val(getUrl() + '?querytype=update&query=' + encodeURIComponent($('#updatearea').val()).replace(/%20/g,'+'));
    });

    $('#inserttoupdate').on('click', function ()
    {
        console.log($('#flipajax').is(':checked'));
        transformer.InsertToUpdate($('#insertarea').val(), '#updatearea', '#ajaxarea', '#functionarea', '#radio_wrapper', $('#flipajax').is(':checked'), function (errormsg)
        {
            alert(errormsg);
        });
		
		$('#urlfield').val(getUrl() + '?querytype=insert&query=' + encodeURIComponent($('#insertarea').val()).replace(/%20/g,'+'));
    });
	
	$('#ajaxtosql').on('click', function ()
    {
        transformer.AjaxToSQL($('#ajaxarea').val(), '#updatearea', '#insertarea', '#functionarea', '#radio_wrapper', function (errormsg)
        {
            alert(errormsg);
        });
		
		$('#urlfield').val(getUrl() + '?querytype=ajax&query=' + encodeURIComponent($('#ajaxarea').val()).replace(/%20/g,'+'));
    });
	
	$('#urlfield').on('click', function()
	{
		$(this).select();	
	});
    
    var modal = new JModal(true, 200, 200, 1000, 800, '<h1>test</h1>');
    
    $(document).on('keypress', function(e)
    {
        switch(String.fromCharCode(e.which).toUpperCase())
        {
            case 'A':
                modal.toggle();
                break;
        }
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
		else if(linkedquerytype == 'ajax')
		{
			$('#ajaxarea').val(linkedquery);
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