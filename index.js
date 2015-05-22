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
    });

    $('#inserttoupdate').on('click', function ()
    {
        transformer.InsertToUpdate($('#insertarea').val(), '#updatearea', '#ajaxarea', function (errormsg)
        {
            alert(errormsg);
        });
    });
});